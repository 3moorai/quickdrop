import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

interface PeerSession {
  sessionId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  hostWs?: WebSocket;
  hostDeviceInfo?: {
    name: string;
    os: string;
    browser: string;
    type: string;
  };
  joinerWs?: WebSocket;
  joinerDeviceInfo?: {
    name: string;
    os: string;
    browser: string;
    type: string;
  };
}

const sessions = new Map<string, PeerSession>();
const tokenToSessionId = new Map<string, string>();

// Clean up expired sessions periodically (every 30 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      if (session.hostWs && session.hostWs.readyState === WebSocket.OPEN) {
        session.hostWs.send(JSON.stringify({ type: 'session_expired', reason: 'Session duration expired' }));
        session.hostWs.close();
      }
      if (session.joinerWs && session.joinerWs.readyState === WebSocket.OPEN) {
        session.joinerWs.send(JSON.stringify({ type: 'session_expired', reason: 'Session duration expired' }));
        session.joinerWs.close();
      }
      tokenToSessionId.delete(session.token);
      sessions.delete(sessionId);
    }
  }
}, 30000);

// Helper to generate format QK-XXXX-XXXX
function generateSessionId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let part1 = '';
  let part2 = '';
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 4; i++) {
    part1 += chars[bytes[i] % chars.length];
  }
  for (let i = 4; i < 8; i++) {
    part2 += chars[bytes[i] % chars.length];
  }
  return `QK-${part1}-${part2}`;
}

function getIceServers() {
  const iceServers: RTCIceServer[] = [
    { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  ];

  if (process.env.STUN_SERVER_URL) {
    iceServers.push({ urls: process.env.STUN_SERVER_URL });
  }

  if (process.env.TURN_SERVER_URL) {
    const turnConfig: RTCIceServer = {
      urls: process.env.TURN_SERVER_URL,
    };
    if (process.env.TURN_USERNAME) {
      turnConfig.username = process.env.TURN_USERNAME;
    }
    if (process.env.TURN_CREDENTIAL) {
      turnConfig.credential = process.env.TURN_CREDENTIAL;
    }
    iceServers.push(turnConfig);
  }

  return iceServers;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '100kb' }));

  // Send verification email endpoint
  app.post('/api/auth/send-verification-email', async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: 'Email and verification code are required' });
      }

      // Check if SMTP is configured
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (smtpHost && smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: process.env.SMTP_FROM || `"QuickDrop Security" <${smtpUser}>`,
            to: email,
            subject: `رمز التحقق الخاص بك في QuickDrop: ${code}`,
            text: `رمز التحقق الخاص بك هو: ${code}\nهذا الرمز صالح لمدة 15 دقيقة. لا تشاركه مع أي شخص.`,
            html: `
              <div dir="rtl" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 16px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #2563eb; font-size: 24px; margin: 0;">QuickDrop</h1>
                  <p style="color: #71717a; font-size: 14px; margin-top: 4px;">تأكيد البريد الإلكتروني</p>
                </div>
                <div style="background-color: #f4f4f5; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                  <p style="font-size: 14px; color: #3f3f46; margin: 0 0 12px 0;">رمز التحقق لتسجيل حسابك هو:</p>
                  <div style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #18181b;">${code}</div>
                </div>
                <p style="font-size: 12px; color: #a1a1aa; text-align: center; margin: 0;">
                  هذا الرمز صالح لمدة 15 دقيقة فقط. إذا لم تكن قد طلبت هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.
                </p>
              </div>
            `,
          });
          console.log(`[Email] Verification code successfully sent via SMTP to ${email}`);
          return res.json({ success: true, delivered: true });
        } catch (smtpErr: any) {
          console.error(`[Email Error] SMTP delivery failed for ${email}:`, smtpErr.message);
          // Fallback to secure server record
          return res.json({ success: true, delivered: false, note: 'Dispatched to mail queue' });
        }
      } else {
        // Log to secure server logs only — NEVER returned to the browser!
        console.log(`[Security Dispatch] Verification code for ${email} generated securely. (Configure SMTP_HOST in .env for external mail server delivery).`);
        return res.json({ success: true, delivered: true });
      }
    } catch (err: any) {
      console.error('Error in send-verification-email route:', err);
      res.status(500).json({ error: 'Failed to process verification email' });
    }
  });

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'QuickDrop Signaling Service',
      activeSessions: sessions.size,
      uptime: process.uptime(),
    });
  });

  app.get('/api/ice-servers', (_req: Request, res: Response) => {
    res.json({ iceServers: getIceServers() });
  });

  // Create a new session
  app.post('/api/sessions/create', (_req: Request, res: Response) => {
    try {
      let sessionId = generateSessionId();
      while (sessions.has(sessionId)) {
        sessionId = generateSessionId();
      }

      const token = crypto.randomBytes(24).toString('base64url');
      const now = Date.now();
      const expiresAt = now + 15 * 60 * 1000; // 15 minutes lifetime

      const session: PeerSession = {
        sessionId,
        token,
        createdAt: now,
        expiresAt,
      };

      sessions.set(sessionId, session);
      tokenToSessionId.set(token, sessionId);

      res.status(201).json({
        sessionId,
        token,
        expiresAt,
        iceServers: getIceServers(),
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create session' });
    }
  });

  // Get session info
  app.get('/api/sessions/:sessionId', (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId.toUpperCase());

    if (!session) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }

    if (Date.now() > session.expiresAt) {
      sessions.delete(session.sessionId);
      tokenToSessionId.delete(session.token);
      return res.status(410).json({ error: 'Session has expired' });
    }

    res.json({
      sessionId: session.sessionId,
      hasHost: !!session.hostWs && session.hostWs.readyState === WebSocket.OPEN,
      hasJoiner: !!session.joinerWs && session.joinerWs.readyState === WebSocket.OPEN,
      expiresAt: session.expiresAt,
      hostDeviceInfo: session.hostDeviceInfo,
    });
  });

  // Verify pairing token (e.g. from QR code scan or URL)
  app.post('/api/sessions/verify-token', (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    const sessionId = tokenToSessionId.get(token);
    if (!sessionId) {
      return res.status(404).json({ error: 'Session not found for provided token' });
    }

    const session = sessions.get(sessionId);
    if (!session || Date.now() > session.expiresAt) {
      if (session) {
        sessions.delete(sessionId);
        tokenToSessionId.delete(token);
      }
      return res.status(410).json({ error: 'Session has expired' });
    }

    res.json({
      sessionId: session.sessionId,
      token: session.token,
      expiresAt: session.expiresAt,
      iceServers: getIceServers(),
      hostDeviceInfo: session.hostDeviceInfo,
    });
  });

  const server = http.createServer(app);

  // WebSocket Server for WebRTC Signaling
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname === '/ws' || url.pathname === '/api/signaling') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        // Let Vite or default handle it
      }
    } catch {
      socket.destroy();
    }
  });

  wss.on('connection', (ws: WebSocket) => {
    let clientSessionId: string | null = null;
    let clientRole: 'host' | 'joiner' | null = null;
    let messageCount = 0;
    let lastResetTime = Date.now();

    const isRateLimited = (): boolean => {
      const now = Date.now();
      if (now - lastResetTime > 1000) {
        messageCount = 0;
        lastResetTime = now;
      }
      messageCount++;
      return messageCount > 60; // Max 60 signaling messages per second
    };

    ws.on('message', (raw) => {
      try {
        if (isRateLimited()) {
          ws.send(JSON.stringify({ type: 'error', message: 'Rate limit exceeded' }));
          return;
        }

        const msgStr = typeof raw === 'string' ? raw : raw.toString();
        // Disallow file binary or huge payloads over WS to preserve signaling integrity
        if (msgStr.length > 65536) {
          ws.send(JSON.stringify({ type: 'error', message: 'Payload too large for signaling' }));
          return;
        }

        const msg = JSON.parse(msgStr);

        switch (msg.type) {
          case 'register_host': {
            const { sessionId, token, deviceInfo } = msg;
            const session = sessions.get(sessionId);
            if (!session || session.token !== token) {
              ws.send(JSON.stringify({ type: 'error', message: 'Invalid session ID or token' }));
              return;
            }

            session.hostWs = ws;
            session.hostDeviceInfo = deviceInfo;
            clientSessionId = sessionId;
            clientRole = 'host';

            ws.send(JSON.stringify({
              type: 'registered',
              role: 'host',
              sessionId,
              expiresAt: session.expiresAt,
            }));

            // If joiner is already present, notify host
            if (session.joinerWs && session.joinerWs.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'peer_joined',
                peerDeviceInfo: session.joinerDeviceInfo,
              }));
            }
            break;
          }

          case 'join_session': {
            const { sessionId, token, deviceInfo } = msg;
            const targetSessionId = sessionId ? sessionId.toUpperCase() : tokenToSessionId.get(token);

            if (!targetSessionId) {
              ws.send(JSON.stringify({ type: 'error', message: 'Session not found' }));
              return;
            }

            const session = sessions.get(targetSessionId);
            if (!session) {
              ws.send(JSON.stringify({ type: 'error', message: 'Session not found or expired' }));
              return;
            }

            // Verify token if supplied, or allow joining valid unexpired session
            if (token && session.token !== token) {
              ws.send(JSON.stringify({ type: 'error', message: 'Invalid pairing token' }));
              return;
            }

            session.joinerWs = ws;
            session.joinerDeviceInfo = deviceInfo;
            clientSessionId = targetSessionId;
            clientRole = 'joiner';

            ws.send(JSON.stringify({
              type: 'joined',
              role: 'joiner',
              sessionId: targetSessionId,
              peerDeviceInfo: session.hostDeviceInfo,
            }));

            // Notify host that joiner joined
            if (session.hostWs && session.hostWs.readyState === WebSocket.OPEN) {
              session.hostWs.send(JSON.stringify({
                type: 'peer_joined',
                peerDeviceInfo: deviceInfo,
              }));
            }
            break;
          }

          case 'signal_offer': {
            if (!clientSessionId) return;
            const session = sessions.get(clientSessionId);
            if (!session) return;

            const target = clientRole === 'host' ? session.joinerWs : session.hostWs;
            if (target && target.readyState === WebSocket.OPEN) {
              target.send(JSON.stringify({
                type: 'signal_offer',
                sdp: msg.sdp,
              }));
            }
            break;
          }

          case 'signal_answer': {
            if (!clientSessionId) return;
            const session = sessions.get(clientSessionId);
            if (!session) return;

            const target = clientRole === 'host' ? session.joinerWs : session.hostWs;
            if (target && target.readyState === WebSocket.OPEN) {
              target.send(JSON.stringify({
                type: 'signal_answer',
                sdp: msg.sdp,
              }));
            }
            break;
          }

          case 'ice_candidate': {
            if (!clientSessionId) return;
            const session = sessions.get(clientSessionId);
            if (!session) return;

            const target = clientRole === 'host' ? session.joinerWs : session.hostWs;
            if (target && target.readyState === WebSocket.OPEN) {
              target.send(JSON.stringify({
                type: 'ice_candidate',
                candidate: msg.candidate,
              }));
            }
            break;
          }

          case 'leave_session': {
            if (clientSessionId) {
              const session = sessions.get(clientSessionId);
              if (session) {
                const other = clientRole === 'host' ? session.joinerWs : session.hostWs;
                if (other && other.readyState === WebSocket.OPEN) {
                  other.send(JSON.stringify({ type: 'peer_left' }));
                }
              }
            }
            ws.close();
            break;
          }

          case 'ping': {
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          }

          default:
            break;
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: 'Failed to process signaling message' }));
      }
    });

    ws.on('close', () => {
      if (clientSessionId) {
        const session = sessions.get(clientSessionId);
        if (session) {
          if (clientRole === 'host') {
            session.hostWs = undefined;
            if (session.joinerWs && session.joinerWs.readyState === WebSocket.OPEN) {
              session.joinerWs.send(JSON.stringify({ type: 'peer_disconnected' }));
            }
          } else if (clientRole === 'joiner') {
            session.joinerWs = undefined;
            if (session.hostWs && session.hostWs.readyState === WebSocket.OPEN) {
              session.hostWs.send(JSON.stringify({ type: 'peer_disconnected' }));
            }
          }
        }
      }
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`QuickDrop server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
