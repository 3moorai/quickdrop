import { DeviceInfo } from '../types.ts';

export interface SignalingCallbacks {
  onRegistered?: (sessionId: string, expiresAt: number) => void;
  onJoined?: (sessionId: string, peerDeviceInfo?: DeviceInfo) => void;
  onPeerJoined?: (peerDeviceInfo?: DeviceInfo) => void;
  onOffer?: (sdp: RTCSessionDescriptionInit) => void;
  onAnswer?: (sdp: RTCSessionDescriptionInit) => void;
  onIceCandidate?: (candidate: RTCIceCandidateInit) => void;
  onPeerDisconnected?: () => void;
  onPeerLeft?: () => void;
  onSessionExpired?: (reason?: string) => void;
  onError?: (message: string) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export class SignalingClient {
  private ws: WebSocket | null = null;
  private callbacks: SignalingCallbacks = {};
  private pingInterval: number | null = null;
  private isExplicitlyClosed = false;

  constructor(callbacks: SignalingCallbacks) {
    this.callbacks = callbacks;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isExplicitlyClosed = false;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        this.ws = new WebSocket(wsUrl);
      } catch (err) {
        return reject(err);
      }

      this.ws.onopen = () => {
        this.callbacks.onConnectionChange?.(true);
        this.startHeartbeat();
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleMessage(msg);
        } catch (err) {
          console.error('Error parsing signaling message:', err);
        }
      };

      this.ws.onerror = (err) => {
        this.callbacks.onError?.('Signaling connection error');
        reject(err);
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        this.callbacks.onConnectionChange?.(false);
      };
    });
  }

  private handleMessage(msg: any) {
    switch (msg.type) {
      case 'registered':
        this.callbacks.onRegistered?.(msg.sessionId, msg.expiresAt);
        break;
      case 'joined':
        this.callbacks.onJoined?.(msg.sessionId, msg.peerDeviceInfo);
        break;
      case 'peer_joined':
        this.callbacks.onPeerJoined?.(msg.peerDeviceInfo);
        break;
      case 'signal_offer':
        this.callbacks.onOffer?.(msg.sdp);
        break;
      case 'signal_answer':
        this.callbacks.onAnswer?.(msg.sdp);
        break;
      case 'ice_candidate':
        this.callbacks.onIceCandidate?.(msg.candidate);
        break;
      case 'peer_disconnected':
        this.callbacks.onPeerDisconnected?.();
        break;
      case 'peer_left':
        this.callbacks.onPeerLeft?.();
        break;
      case 'session_expired':
        this.callbacks.onSessionExpired?.(msg.reason);
        break;
      case 'error':
        this.callbacks.onError?.(msg.message || 'Unknown signaling error');
        break;
      case 'pong':
        break;
      default:
        break;
    }
  }

  public registerHost(sessionId: string, token: string, deviceInfo: DeviceInfo) {
    this.send({
      type: 'register_host',
      sessionId,
      token,
      deviceInfo,
    });
  }

  public joinSession(sessionId: string, token: string, deviceInfo: DeviceInfo) {
    this.send({
      type: 'join_session',
      sessionId,
      token,
      deviceInfo,
    });
  }

  public sendOffer(sdp: RTCSessionDescriptionInit) {
    this.send({
      type: 'signal_offer',
      sdp,
    });
  }

  public sendAnswer(sdp: RTCSessionDescriptionInit) {
    this.send({
      type: 'signal_answer',
      sdp,
    });
  }

  public sendIceCandidate(candidate: RTCIceCandidateInit) {
    this.send({
      type: 'ice_candidate',
      candidate,
    });
  }

  public leave() {
    this.send({ type: 'leave_session' });
    this.close();
  }

  private send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = window.setInterval(() => {
      this.send({ type: 'ping' });
    }, 20000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public close() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
