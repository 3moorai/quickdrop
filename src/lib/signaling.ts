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
  private retryInterval: number | null = null;
  private isExplicitlyClosed = false;
  private role: 'host' | 'joiner' = 'host';
  private sessionId = '';
  private safeTopic = '';
  private localDeviceInfo?: DeviceInfo;
  private isConnected = false;

  constructor(callbacks: SignalingCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Connect to signaling relay for a given session ID
   */
  public async connect(sessionId: string, role: 'host' | 'joiner'): Promise<void> {
    this.isExplicitlyClosed = false;
    this.role = role;
    this.sessionId = sessionId;
    this.safeTopic = 'quickdrop-' + sessionId.toLowerCase().replace(/[^a-z0-9]/g, '');

    return new Promise((resolve) => {
      try {
        const wsUrl = `wss://ntfy.sh/${this.safeTopic}/ws`;
        const ws = new WebSocket(wsUrl);

        const timeout = window.setTimeout(() => {
          this.isConnected = true;
          this.callbacks.onConnectionChange?.(true);
          resolve();
        }, 3500);

        ws.onopen = () => {
          clearTimeout(timeout);
          this.ws = ws;
          this.isConnected = true;
          this.callbacks.onConnectionChange?.(true);
          this.startHeartbeat();
          resolve();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === 'message' && typeof data.message === 'string') {
              try {
                const payload = JSON.parse(data.message);
                this.handleRelayMessage(payload);
              } catch {
                // ignore non-json messages
              }
            }
          } catch (err) {
            console.error('Error parsing signaling message:', err);
          }
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          this.isConnected = true;
          resolve();
        };

        ws.onclose = () => {
          this.stopHeartbeat();
          this.callbacks.onConnectionChange?.(false);
          if (!this.isExplicitlyClosed && this.safeTopic) {
            setTimeout(() => {
              if (!this.isExplicitlyClosed) {
                this.connect(this.sessionId, this.role).catch(() => {});
              }
            }, 2000);
          }
        };
      } catch {
        this.isConnected = true;
        resolve();
      }
    });
  }

  private handleRelayMessage(msg: any) {
    if (!msg || typeof msg !== 'object') return;
    if (msg.sender === this.role) return;

    switch (msg.type) {
      case 'join_session':
        if (this.role === 'host') {
          this.send({
            type: 'host_ack',
            sessionId: this.sessionId,
            deviceInfo: this.localDeviceInfo,
          });
          this.callbacks.onPeerJoined?.(msg.deviceInfo);
        }
        break;

      case 'host_ack':
        if (this.role === 'joiner') {
          this.stopRetry();
          this.callbacks.onJoined?.(this.sessionId, msg.deviceInfo);
        }
        break;

      case 'signal_offer':
        if (this.role === 'joiner') {
          this.stopRetry();
          this.callbacks.onOffer?.(msg.sdp);
        }
        break;

      case 'signal_answer':
        if (this.role === 'host') {
          this.callbacks.onAnswer?.(msg.sdp);
        }
        break;

      case 'ice_candidate':
        if (msg.candidate) {
          this.callbacks.onIceCandidate?.(msg.candidate);
        }
        break;

      case 'peer_left':
      case 'leave_session':
        this.callbacks.onPeerLeft?.();
        break;

      case 'session_expired':
        this.callbacks.onSessionExpired?.(msg.reason);
        break;

      default:
        break;
    }
  }

  public registerHost(sessionId: string, _token: string, deviceInfo: DeviceInfo) {
    this.role = 'host';
    this.sessionId = sessionId;
    this.localDeviceInfo = deviceInfo;
    this.safeTopic = 'quickdrop-' + sessionId.toLowerCase().replace(/[^a-z0-9]/g, '');

    this.callbacks.onRegistered?.(sessionId, Date.now() + 15 * 60 * 1000);

    this.send({
      type: 'host_ready',
      sessionId,
      deviceInfo,
    });
  }

  public joinSession(sessionId: string, _token: string, deviceInfo: DeviceInfo) {
    this.role = 'joiner';
    this.sessionId = sessionId;
    this.localDeviceInfo = deviceInfo;
    this.safeTopic = 'quickdrop-' + sessionId.toLowerCase().replace(/[^a-z0-9]/g, '');

    const sendJoin = () => {
      this.send({
        type: 'join_session',
        sessionId,
        deviceInfo,
      });
    };

    sendJoin();

    let retries = 0;
    this.stopRetry();
    this.retryInterval = window.setInterval(() => {
      retries++;
      if (retries > 8) {
        this.stopRetry();
        return;
      }
      sendJoin();
    }, 1500);
  }

  private stopRetry() {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
      this.retryInterval = null;
    }
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
    this.send({ type: 'peer_left' });
    this.close();
  }

  private async send(payload: any) {
    if (!this.safeTopic) return;
    const body = JSON.stringify({
      ...payload,
      sender: this.role,
      timestamp: Date.now(),
    });

    try {
      await fetch(`https://ntfy.sh/${this.safeTopic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } catch (err) {
      console.warn('Signaling send error:', err);
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = window.setInterval(() => {
      // Keep alive interval
    }, 25000);
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
    this.stopRetry();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
  }
}
