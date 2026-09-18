import { DeviceInfo, FileTransferItem, TextTransferItem } from '../types.ts';
import { calculateSha256, sanitizeFilename } from './crypto.ts';

const CHUNK_SIZE = 64 * 1024; // 64 KB chunk size
const BUFFERED_AMOUNT_LOW_THRESHOLD = 256 * 1024; // 256 KB
const MAX_BUFFERED_AMOUNT = 1024 * 1024; // 1 MB buffer backpressure limit

export interface WebRTCManagerCallbacks {
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onDataChannelStateChange: (isOpen: boolean) => void;
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
  onOfferCreated: (sdp: RTCSessionDescriptionInit) => void;
  onAnswerCreated: (sdp: RTCSessionDescriptionInit) => void;
  onPeerDeviceInfo: (info: DeviceInfo) => void;
  onIncomingFileOffer: (item: FileTransferItem) => void;
  onFileProgress: (item: FileTransferItem) => void;
  onFileCompleted: (item: FileTransferItem) => void;
  onFileFailed: (itemId: string, error: string) => void;
  onIncomingText: (item: TextTransferItem) => void;
}

export class WebRTCManager {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private callbacks: WebRTCManagerCallbacks;
  private localDeviceInfo: DeviceInfo;
  private iceServers: RTCIceServer[];

  // Ongoing transfers
  private activeOutgoingTransfer: {
    item: FileTransferItem;
    file: File;
    cancelled: boolean;
    lastReportedTime: number;
    lastReportedBytes: number;
    smoothedSpeed: number;
  } | null = null;

  private activeIncomingTransfers = new Map<string, {
    item: FileTransferItem;
    chunks: Uint8Array[];
    receivedBytes: number;
    totalBytes: number;
    startTime: number;
    lastReportedTime: number;
    lastReportedBytes: number;
    smoothedSpeed: number;
  }>();

  constructor(
    localDeviceInfo: DeviceInfo,
    iceServers: RTCIceServer[],
    callbacks: WebRTCManagerCallbacks
  ) {
    this.localDeviceInfo = localDeviceInfo;
    this.iceServers = iceServers;
    this.callbacks = callbacks;
  }

  public async initializePeerConnection(isInitiator: boolean): Promise<void> {
    this.close();

    const config: RTCConfiguration = {
      iceServers: this.iceServers.length > 0 ? this.iceServers : [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' },
        { urls: 'stun:stun.services.mozilla.com' },
      ],
      iceCandidatePoolSize: 4,
    };

    this.pc = new RTCPeerConnection(config);

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.callbacks.onIceCandidate(event.candidate.toJSON());
      }
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc) {
        this.callbacks.onConnectionStateChange(this.pc.connectionState);
      }
    };

    if (isInitiator) {
      // Host creates the DataChannel
      const dc = this.pc.createDataChannel('quickdrop-transfer', {
        ordered: true,
      });
      this.setupDataChannel(dc);

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      this.callbacks.onOfferCreated(offer);
    } else {
      // Joiner listens for incoming DataChannel
      this.pc.ondatachannel = (event) => {
        this.setupDataChannel(event.channel);
      };
    }
  }

  public async handleReceivedOffer(sdp: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) return;
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    this.callbacks.onAnswerCreated(answer);
  }

  public async handleReceivedAnswer(sdp: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) return;
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  public async handleReceivedIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.pc) return;
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.warn('Error adding ICE candidate:', err);
    }
  }

  private setupDataChannel(channel: RTCDataChannel) {
    this.dataChannel = channel;
    this.dataChannel.binaryType = 'arraybuffer';
    this.dataChannel.bufferedAmountLowThreshold = BUFFERED_AMOUNT_LOW_THRESHOLD;

    this.dataChannel.onopen = () => {
      this.callbacks.onDataChannelStateChange(true);
      // Immediately share local device identity
      this.sendControlMessage({
        type: 'DEVICE_INFO',
        deviceInfo: this.localDeviceInfo,
      });
    };

    this.dataChannel.onclose = () => {
      this.callbacks.onDataChannelStateChange(false);
    };

    this.dataChannel.onerror = (err) => {
      console.error('DataChannel error:', err);
    };

    this.dataChannel.onmessage = (event) => {
      this.handleIncomingData(event.data);
    };
  }

  private handleIncomingData(data: string | ArrayBuffer) {
    if (typeof data === 'string') {
      try {
        const msg = JSON.parse(data);
        this.handleControlMessage(msg);
      } catch (err) {
        console.error('Failed to parse control message:', err);
      }
    } else if (data instanceof ArrayBuffer) {
      this.handleIncomingBinaryChunk(data);
    }
  }

  private handleControlMessage(msg: any) {
    switch (msg.type) {
      case 'DEVICE_INFO':
        this.callbacks.onPeerDeviceInfo(msg.deviceInfo);
        break;

      case 'FILE_OFFER': {
        const safeName = sanitizeFilename(msg.name);
        const item: FileTransferItem = {
          id: msg.id,
          name: safeName,
          size: msg.size,
          type: msg.fileType || 'application/octet-stream',
          lastModified: msg.lastModified,
          progress: 0,
          transferredBytes: 0,
          speed: 0,
          eta: 0,
          state: 'offered',
          isIncoming: true,
          totalChunks: msg.totalChunks,
          chunksReceived: 0,
        };

        this.callbacks.onIncomingFileOffer(item);
        break;
      }

      case 'FILE_ACCEPT': {
        if (this.activeOutgoingTransfer && this.activeOutgoingTransfer.item.id === msg.id) {
          this.executeFileTransfer();
        }
        break;
      }

      case 'FILE_REJECT': {
        if (this.activeOutgoingTransfer && this.activeOutgoingTransfer.item.id === msg.id) {
          this.activeOutgoingTransfer.item.state = 'cancelled';
          this.activeOutgoingTransfer.item.error = msg.reason || 'Rejected by peer';
          this.callbacks.onFileFailed(msg.id, 'Transfer was declined by the receiver');
          this.activeOutgoingTransfer = null;
        }
        break;
      }

      case 'FILE_CANCEL': {
        const incoming = this.activeIncomingTransfers.get(msg.id);
        if (incoming) {
          incoming.item.state = 'cancelled';
          this.callbacks.onFileFailed(msg.id, 'Sender cancelled the transfer');
          this.activeIncomingTransfers.delete(msg.id);
        }
        break;
      }

      case 'FILE_COMPLETE': {
        // Handled after binary verification
        break;
      }

      case 'TEXT_MESSAGE': {
        const item: TextTransferItem = {
          id: msg.id,
          text: msg.text,
          isUrl: !!msg.isUrl,
          timestamp: msg.timestamp || Date.now(),
          isIncoming: true,
        };
        this.callbacks.onIncomingText(item);
        break;
      }

      default:
        break;
    }
  }

  private async handleIncomingBinaryChunk(buffer: ArrayBuffer) {
    const view = new DataView(buffer);
    if (view.byteLength < 4) return;

    const magic0 = view.getUint8(0);
    const magic1 = view.getUint8(1);
    if (magic0 !== 0x51 || magic1 !== 0x44) {
      // Not a QuickDrop chunk
      return;
    }

    const headerLength = view.getUint16(2);
    if (view.byteLength < 4 + headerLength) return;

    const headerBytes = new Uint8Array(buffer, 4, headerLength);
    const headerStr = new TextDecoder().decode(headerBytes);
    const header = JSON.parse(headerStr);

    const chunkData = new Uint8Array(buffer, 4 + headerLength);

    const transfer = this.activeIncomingTransfers.get(header.id);
    if (!transfer) return;

    transfer.chunks[header.chunkIndex] = chunkData;
    transfer.receivedBytes += chunkData.byteLength;
    transfer.item.transferredBytes = transfer.receivedBytes;
    transfer.item.chunksReceived = (transfer.item.chunksReceived || 0) + 1;
    transfer.item.progress = Math.min(100, Math.round((transfer.receivedBytes / transfer.totalBytes) * 100));

    // Calculate real speed and ETA with smoothing
    const now = performance.now();
    const elapsedSinceLast = (now - transfer.lastReportedTime) / 1000;
    if (elapsedSinceLast >= 0.2 || transfer.receivedBytes === transfer.totalBytes) {
      const bytesInWindow = transfer.receivedBytes - transfer.lastReportedBytes;
      const instantSpeed = elapsedSinceLast > 0 ? bytesInWindow / elapsedSinceLast : 0;
      transfer.smoothedSpeed = transfer.smoothedSpeed === 0 ? instantSpeed : 0.7 * instantSpeed + 0.3 * transfer.smoothedSpeed;
      transfer.item.speed = transfer.smoothedSpeed;

      const remainingBytes = transfer.totalBytes - transfer.receivedBytes;
      transfer.item.eta = transfer.smoothedSpeed > 0 ? remainingBytes / transfer.smoothedSpeed : 0;

      transfer.lastReportedTime = now;
      transfer.lastReportedBytes = transfer.receivedBytes;
      transfer.item.state = 'transferring';
      this.callbacks.onFileProgress({ ...transfer.item });
    }

    // Check if completed
    if (transfer.receivedBytes >= transfer.totalBytes) {
      transfer.item.state = 'verifying';
      this.callbacks.onFileProgress({ ...transfer.item });

      // Reconstruct file Blob from chunks
      const fileBlob = new Blob(transfer.chunks as BlobPart[], { type: transfer.item.type });
      const arrayBuf = await fileBlob.arrayBuffer();
      const calculatedHash = await calculateSha256(arrayBuf);

      transfer.item.sha256 = calculatedHash;
      transfer.item.state = 'completed';
      transfer.item.progress = 100;
      transfer.item.speed = 0;
      transfer.item.eta = 0;
      transfer.item.blobUrl = URL.createObjectURL(fileBlob);
      transfer.item.endTime = Date.now();

      this.callbacks.onFileCompleted({ ...transfer.item });
      this.activeIncomingTransfers.delete(header.id);
    }
  }

  public acceptIncomingFile(item: FileTransferItem) {
    const totalChunks = Math.ceil(item.size / CHUNK_SIZE);
    this.activeIncomingTransfers.set(item.id, {
      item,
      chunks: new Array(totalChunks),
      receivedBytes: 0,
      totalBytes: item.size,
      startTime: performance.now(),
      lastReportedTime: performance.now(),
      lastReportedBytes: 0,
      smoothedSpeed: 0,
    });

    item.state = 'preparing';
    this.callbacks.onFileProgress({ ...item });

    this.sendControlMessage({
      type: 'FILE_ACCEPT',
      id: item.id,
    });
  }

  public rejectIncomingFile(itemId: string, reason = 'User declined') {
    this.activeIncomingTransfers.delete(itemId);
    this.sendControlMessage({
      type: 'FILE_REJECT',
      id: itemId,
      reason,
    });
  }

  public offerFileToSend(file: File): FileTransferItem {
    const safeName = sanitizeFilename(file.name);
    const transferId = `transfer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    const item: FileTransferItem = {
      id: transferId,
      name: safeName,
      size: file.size,
      type: file.type || 'application/octet-stream',
      lastModified: file.lastModified,
      progress: 0,
      transferredBytes: 0,
      speed: 0,
      eta: 0,
      state: 'pending',
      isIncoming: false,
      totalChunks,
      chunksReceived: 0,
    };

    this.activeOutgoingTransfer = {
      item,
      file,
      cancelled: false,
      lastReportedTime: performance.now(),
      lastReportedBytes: 0,
      smoothedSpeed: 0,
    };

    // Send offer to receiver
    this.sendControlMessage({
      type: 'FILE_OFFER',
      id: item.id,
      name: safeName,
      size: file.size,
      fileType: file.type,
      totalChunks,
      chunkSize: CHUNK_SIZE,
      lastModified: file.lastModified,
    });

    return item;
  }

  private async executeFileTransfer() {
    if (!this.activeOutgoingTransfer || !this.dataChannel || this.dataChannel.readyState !== 'open') {
      return;
    }

    const { item, file } = this.activeOutgoingTransfer;
    item.state = 'transferring';
    item.startTime = Date.now();
    this.callbacks.onFileProgress({ ...item });

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let offset = 0;
    let chunkIndex = 0;

    const fileReader = new FileReader();

    const readSlice = (start: number, end: number): Promise<ArrayBuffer> => {
      return new Promise((resolve, reject) => {
        const slice = file.slice(start, end);
        fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
        fileReader.onerror = () => reject(fileReader.error);
        fileReader.readAsArrayBuffer(slice);
      });
    };

    while (chunkIndex < totalChunks) {
      if (this.activeOutgoingTransfer?.cancelled) {
        this.sendControlMessage({ type: 'FILE_CANCEL', id: item.id });
        item.state = 'cancelled';
        this.callbacks.onFileFailed(item.id, 'Transfer cancelled');
        this.activeOutgoingTransfer = null;
        return;
      }

      // WebRTC DataChannel Flow Control (Backpressure)
      if (this.dataChannel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
        await new Promise<void>((resolve) => {
          const handler = () => {
            if (this.dataChannel) {
              this.dataChannel.removeEventListener('bufferedamountlow', handler);
            }
            resolve();
          };
          this.dataChannel?.addEventListener('bufferedamountlow', handler);
        });
      }

      const nextOffset = Math.min(offset + CHUNK_SIZE, file.size);
      let rawChunk: ArrayBuffer;
      try {
        rawChunk = await readSlice(offset, nextOffset);
      } catch (err) {
        item.state = 'failed';
        item.error = 'Failed to read file from disk';
        this.callbacks.onFileFailed(item.id, item.error);
        this.activeOutgoingTransfer = null;
        return;
      }

      // Encode packet with 4-byte header + JSON metadata + raw chunk bytes
      const headerObj = { id: item.id, chunkIndex, totalChunks };
      const headerBytes = new TextEncoder().encode(JSON.stringify(headerObj));
      const headerLength = headerBytes.byteLength;

      const packetBuffer = new ArrayBuffer(4 + headerLength + rawChunk.byteLength);
      const view = new DataView(packetBuffer);
      view.setUint8(0, 0x51); // 'Q'
      view.setUint8(1, 0x44); // 'D'
      view.setUint16(2, headerLength);

      const packetUint8 = new Uint8Array(packetBuffer);
      packetUint8.set(headerBytes, 4);
      packetUint8.set(new Uint8Array(rawChunk), 4 + headerLength);

      try {
        this.dataChannel.send(packetBuffer);
      } catch (err) {
        item.state = 'failed';
        item.error = 'DataChannel transmission failed';
        this.callbacks.onFileFailed(item.id, item.error);
        this.activeOutgoingTransfer = null;
        return;
      }

      offset = nextOffset;
      chunkIndex++;

      item.transferredBytes = offset;
      item.progress = Math.min(100, Math.round((offset / file.size) * 100));

      const now = performance.now();
      const elapsedSinceLast = (now - this.activeOutgoingTransfer.lastReportedTime) / 1000;
      if (elapsedSinceLast >= 0.2 || chunkIndex === totalChunks) {
        const bytesInWindow = offset - this.activeOutgoingTransfer.lastReportedBytes;
        const instantSpeed = elapsedSinceLast > 0 ? bytesInWindow / elapsedSinceLast : 0;
        this.activeOutgoingTransfer.smoothedSpeed =
          this.activeOutgoingTransfer.smoothedSpeed === 0
            ? instantSpeed
            : 0.7 * instantSpeed + 0.3 * this.activeOutgoingTransfer.smoothedSpeed;
        item.speed = this.activeOutgoingTransfer.smoothedSpeed;

        const remainingBytes = file.size - offset;
        item.eta = this.activeOutgoingTransfer.smoothedSpeed > 0 ? remainingBytes / this.activeOutgoingTransfer.smoothedSpeed : 0;

        this.activeOutgoingTransfer.lastReportedTime = now;
        this.activeOutgoingTransfer.lastReportedBytes = offset;
        this.callbacks.onFileProgress({ ...item });
      }
    }

    // All chunks sent successfully
    item.state = 'completed';
    item.progress = 100;
    item.speed = 0;
    item.eta = 0;
    item.endTime = Date.now();
    this.callbacks.onFileCompleted({ ...item });
    this.activeOutgoingTransfer = null;
  }

  public cancelTransfer(itemId: string) {
    if (this.activeOutgoingTransfer && this.activeOutgoingTransfer.item.id === itemId) {
      this.activeOutgoingTransfer.cancelled = true;
    }
    const incoming = this.activeIncomingTransfers.get(itemId);
    if (incoming) {
      this.rejectIncomingFile(itemId, 'Receiver cancelled');
    }
  }

  public sendTextMessage(text: string): TextTransferItem {
    const isUrl = /^https?:\/\/\S+$/i.test(text.trim());
    const item: TextTransferItem = {
      id: `text-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: text.trim(),
      isUrl,
      timestamp: Date.now(),
      isIncoming: false,
    };

    this.sendControlMessage({
      type: 'TEXT_MESSAGE',
      id: item.id,
      text: item.text,
      isUrl: item.isUrl,
      timestamp: item.timestamp,
    });

    return item;
  }

  private sendControlMessage(payload: any) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      try {
        this.dataChannel.send(JSON.stringify(payload));
      } catch (err) {
        console.error('Failed to send control message:', err);
      }
    }
  }

  public close() {
    if (this.dataChannel) {
      try {
        this.dataChannel.close();
      } catch {}
      this.dataChannel = null;
    }
    if (this.pc) {
      try {
        this.pc.close();
      } catch {}
      this.pc = null;
    }
    this.activeOutgoingTransfer = null;
    this.activeIncomingTransfers.clear();
  }
}
