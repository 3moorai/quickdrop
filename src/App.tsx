/**
 * QuickDrop - Production Cross-Device P2P File & Text Transfer
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { LandingView } from './components/LandingView.tsx';
import { PairingCard } from './components/PairingCard.tsx';
import { QrScannerModal } from './components/QrScannerModal.tsx';
import { ManualJoinModal } from './components/ManualJoinModal.tsx';
import { TransferDashboard } from './components/TransferDashboard.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { PrivacyView } from './components/PrivacyView.tsx';
import { HelpView } from './components/HelpView.tsx';
import { AuthView } from './components/AuthView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { 
  AppTab, 
  ConnectionState, 
  DeviceInfo, 
  FileTransferItem, 
  SessionData, 
  TextTransferItem,
  UserProfile
} from './types.ts';
import { getLocalDeviceInfo } from './lib/device.ts';
import { SignalingClient } from './lib/signaling.ts';
import { WebRTCManager } from './lib/webrtc.ts';
import { getActiveUser, signOutUser } from './lib/auth.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('transfer');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [rawDeviceInfo] = useState<DeviceInfo>(getLocalDeviceInfo());
  const [peerDeviceInfo, setPeerDeviceInfo] = useState<DeviceInfo | undefined>(undefined);

  // Compute effective device name based on logged-in user profile
  const localDeviceInfo: DeviceInfo = useMemo(() => {
    if (!currentUser) return rawDeviceInfo;
    return {
      ...rawDeviceInfo,
      name: currentUser.deviceName?.trim() || currentUser.name?.trim() || rawDeviceInfo.name,
    };
  }, [rawDeviceInfo, currentUser]);

  const [session, setSession] = useState<SessionData | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isManualJoinOpen, setIsManualJoinOpen] = useState(false);

  // Transfers
  const [files, setFiles] = useState<FileTransferItem[]>([]);
  const [texts, setTexts] = useState<TextTransferItem[]>([]);
  const [incomingOffer, setIncomingOffer] = useState<FileTransferItem | null>(null);
  const [autoAccept, setAutoAccept] = useState<boolean>(() => {
    return localStorage.getItem('quickdrop_auto_accept') === 'true';
  });

  const signalingClientRef = useRef<SignalingClient | null>(null);
  const webrtcManagerRef = useRef<WebRTCManager | null>(null);
  const iceServersRef = useRef<RTCIceServer[]>([]);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('quickdrop_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
  }, []);

  // Check current authenticated user session on mount
  useEffect(() => {
    let mounted = true;
    getActiveUser()
      .then((user) => {
        if (mounted) {
          setCurrentUser(user);
          setIsAuthLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Auth check error:', err);
        if (mounted) setIsAuthLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    handleEndSession();
    setCurrentUser(null);
    setCurrentTab('transfer');
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('quickdrop_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark');
      }
      return nextTheme;
    });
  };

  const handleToggleAutoAccept = (val: boolean) => {
    setAutoAccept(val);
    localStorage.setItem('quickdrop_auto_accept', String(val));
  };

  // Fetch configured ICE servers on mount
  useEffect(() => {
    fetch('/api/ice-servers')
      .then((res) => res.json())
      .then((data) => {
        if (data.iceServers) {
          iceServersRef.current = data.iceServers;
        }
      })
      .catch((err) => console.warn('Failed to fetch ICE servers:', err));
  }, []);

  // Initialize or recreate WebRTC Manager
  const getOrCreateWebRTC = useCallback((isInitiator: boolean) => {
    if (webrtcManagerRef.current) {
      webrtcManagerRef.current.close();
    }

    const manager = new WebRTCManager(
      localDeviceInfo,
      iceServersRef.current,
      {
        onConnectionStateChange: (pcState) => {
          if (pcState === 'connected') {
            setConnectionState('connected');
          } else if (pcState === 'disconnected' || pcState === 'failed') {
            setConnectionState('disconnected');
          }
        },
        onDataChannelStateChange: (isOpen) => {
          if (isOpen) {
            setConnectionState('connected');
          } else {
            if (connectionState === 'connected') {
              setConnectionState('disconnected');
            }
          }
        },
        onIceCandidate: (candidate) => {
          signalingClientRef.current?.sendIceCandidate(candidate);
        },
        onOfferCreated: (sdp) => {
          signalingClientRef.current?.sendOffer(sdp);
        },
        onAnswerCreated: (sdp) => {
          signalingClientRef.current?.sendAnswer(sdp);
        },
        onPeerDeviceInfo: (info) => {
          setPeerDeviceInfo(info);
        },
        onIncomingFileOffer: (item) => {
          if (autoAccept) {
            manager.acceptIncomingFile(item);
          } else {
            setIncomingOffer(item);
          }
          setFiles((prev) => [item, ...prev.filter((f) => f.id !== item.id)]);
        },
        onFileProgress: (item) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...item } : f))
          );
        },
        onFileCompleted: (item) => {
          setIncomingOffer((current) => (current?.id === item.id ? null : current));
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...item } : f))
          );
        },
        onFileFailed: (itemId, error) => {
          setIncomingOffer((current) => (current?.id === itemId ? null : current));
          setFiles((prev) =>
            prev.map((f) => (f.id === itemId ? { ...f, state: 'failed', error } : f))
          );
        },
        onIncomingText: (item) => {
          setTexts((prev) => [item, ...prev]);
        },
      }
    );

    webrtcManagerRef.current = manager;
    return manager;
  }, [localDeviceInfo, autoAccept, connectionState]);

  // Create a new Session (Host)
  const handleStartSession = async () => {
    setIsCreatingSession(true);
    setConnectionState('creating');

    try {
      let data: any = null;
      try {
        const res = await fetch('/api/sessions/create', { method: 'POST' });
        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // Static host / GitHub Pages fallback
      }

      if (!data || !data.sessionId) {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        const randChar = () => chars[Math.floor(Math.random() * chars.length)];
        const code1 = Array.from({ length: 4 }, randChar).join('');
        const code2 = Array.from({ length: 4 }, randChar).join('');
        const sid = `QK-${code1}-${code2}`;
        const tok = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        data = {
          sessionId: sid,
          token: tok,
          expiresAt: Date.now() + 15 * 60 * 1000,
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        };
      }

      if (data.iceServers) {
        iceServersRef.current = data.iceServers;
      }

      const newSession: SessionData = {
        sessionId: data.sessionId,
        token: data.token,
        expiresAt: data.expiresAt,
        role: 'host',
      };

      setSession(newSession);
      try {
        sessionStorage.setItem('quickdrop_active_host_session', JSON.stringify(newSession));
      } catch {}

      // Connect signaling client
      const signaling = new SignalingClient({
        onRegistered: () => {
          setConnectionState('waiting');
        },
        onPeerJoined: async (peerInfo) => {
          if (peerInfo) setPeerDeviceInfo(peerInfo);
          setConnectionState('connecting');

          // Host creates offer
          const rtc = getOrCreateWebRTC(true);
          await rtc.initializePeerConnection(true);

          // Flush any buffered candidates
          for (const cand of pendingCandidatesRef.current) {
            await rtc.handleReceivedIceCandidate(cand);
          }
          pendingCandidatesRef.current = [];
        },
        onAnswer: async (sdp) => {
          await webrtcManagerRef.current?.handleReceivedAnswer(sdp);
        },
        onIceCandidate: async (candidate) => {
          if (webrtcManagerRef.current) {
            await webrtcManagerRef.current.handleReceivedIceCandidate(candidate);
          } else {
            pendingCandidatesRef.current.push(candidate);
          }
        },
        onPeerDisconnected: () => {
          setConnectionState('disconnected');
        },
        onPeerLeft: () => {
          setConnectionState('disconnected');
        },
        onSessionExpired: () => {
          handleEndSession();
        },
        onError: (err) => {
          console.warn('Signaling message:', err);
        },
      });

      try {
        await signaling.connect(newSession.sessionId, 'host');
        signaling.registerHost(newSession.sessionId, newSession.token, localDeviceInfo);
        signalingClientRef.current = signaling;
      } catch {
        setConnectionState('waiting');
      }
    } catch (err) {
      console.error(err);
      setConnectionState('error');
    } finally {
      setIsCreatingSession(false);
    }
  };

  // Join an existing Session (Joiner)
  const handleJoinSession = async (tokenOrCode: string, optionalToken?: string) => {
    setConnectionState('connecting');

    try {
      let targetSessionId = '';
      let targetToken = optionalToken || tokenOrCode;
      let targetExpires = Date.now() + 15 * 60 * 1000;

      const qkMatch = tokenOrCode.match(/QK-[A-Z0-9]{4}-[A-Z0-9]{4}/i);
      if (qkMatch) {
        targetSessionId = qkMatch[0].toUpperCase();
      } else if (/^[A-Z0-9]{8}$/i.test(tokenOrCode)) {
        targetSessionId = `QK-${tokenOrCode.slice(0, 4).toUpperCase()}-${tokenOrCode.slice(4, 8).toUpperCase()}`;
      } else {
        targetSessionId = tokenOrCode.toUpperCase();
      }

      const joinSessionData: SessionData = {
        sessionId: targetSessionId,
        token: targetToken,
        expiresAt: targetExpires,
        role: 'joiner',
      };

      setSession(joinSessionData);
      setIsScannerOpen(false);
      setIsManualJoinOpen(false);

      const signaling = new SignalingClient({
        onJoined: (_sid, hostInfo) => {
          if (hostInfo) setPeerDeviceInfo(hostInfo);
          setConnectionState('connecting');
        },
        onOffer: async (sdp) => {
          // Joiner receives offer -> initializes RTC and answers
          const rtc = getOrCreateWebRTC(false);
          await rtc.initializePeerConnection(false);
          await rtc.handleReceivedOffer(sdp);

          // Flush any buffered candidates
          for (const cand of pendingCandidatesRef.current) {
            await rtc.handleReceivedIceCandidate(cand);
          }
          pendingCandidatesRef.current = [];
        },
        onIceCandidate: async (candidate) => {
          if (webrtcManagerRef.current) {
            await webrtcManagerRef.current.handleReceivedIceCandidate(candidate);
          } else {
            pendingCandidatesRef.current.push(candidate);
          }
        },
        onPeerDisconnected: () => {
          setConnectionState('disconnected');
        },
        onPeerLeft: () => {
          setConnectionState('disconnected');
        },
        onSessionExpired: () => {
          handleEndSession();
        },
        onError: (err) => {
          console.warn('Signaling message:', err);
        },
      });

      try {
        await signaling.connect(targetSessionId, 'joiner');
        signaling.joinSession(targetSessionId, targetToken, localDeviceInfo);
        signalingClientRef.current = signaling;
      } catch {
        setConnectionState('connecting');
      }
    } catch (err: any) {
      console.warn(err);
      setConnectionState('idle');
    }
  };

  // Check URL parameters for direct join or restore active session on refresh
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const joinToken = params.get('join');

    if (code) {
      handleJoinSession(code, joinToken || undefined).catch(() => {});
    } else if (joinToken) {
      handleJoinSession(joinToken).catch(() => {});
    } else {
      // Check if user refreshed an ongoing session
      try {
        const saved = sessionStorage.getItem('quickdrop_active_host_session');
        if (saved) {
          const sessionObj = JSON.parse(saved);
          if (sessionObj && sessionObj.sessionId && sessionObj.expiresAt > Date.now() + 15000) {
            setSession(sessionObj);
            const signaling = new SignalingClient({
              onRegistered: () => setConnectionState('waiting'),
              onPeerJoined: async (peerInfo) => {
                if (peerInfo) setPeerDeviceInfo(peerInfo);
                setConnectionState('connecting');
                const rtc = getOrCreateWebRTC(true);
                await rtc.initializePeerConnection(true);
                for (const cand of pendingCandidatesRef.current) {
                  await rtc.handleReceivedIceCandidate(cand);
                }
                pendingCandidatesRef.current = [];
              },
              onAnswer: async (sdp) => {
                await webrtcManagerRef.current?.handleReceivedAnswer(sdp);
              },
              onIceCandidate: async (candidate) => {
                if (webrtcManagerRef.current) {
                  await webrtcManagerRef.current.handleReceivedIceCandidate(candidate);
                } else {
                  pendingCandidatesRef.current.push(candidate);
                }
              },
              onPeerDisconnected: () => setConnectionState('disconnected'),
              onPeerLeft: () => setConnectionState('disconnected'),
              onSessionExpired: () => handleEndSession(),
              onError: (err) => console.warn('Signaling message:', err),
            });

            signaling.connect(sessionObj.sessionId, 'host').then(() => {
              signaling.registerHost(sessionObj.sessionId, sessionObj.token, localDeviceInfo);
              signalingClientRef.current = signaling;
            });
            return;
          } else {
            sessionStorage.removeItem('quickdrop_active_host_session');
          }
        }
      } catch {}
    }
  }, []);

  // End active session
  const handleEndSession = () => {
    try {
      sessionStorage.removeItem('quickdrop_active_host_session');
    } catch {}

    signalingClientRef.current?.leave();
    signalingClientRef.current = null;

    webrtcManagerRef.current?.close();
    webrtcManagerRef.current = null;

    setSession(null);
    setPeerDeviceInfo(undefined);
    setConnectionState('idle');
    setIncomingOffer(null);

    // Clean URL query parameters without reloading
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // Send Files
  const handleSendFiles = (fileList: FileList | File[]) => {
    if (!webrtcManagerRef.current) return;
    const filesArray = Array.from(fileList);
    for (const file of filesArray) {
      const item = webrtcManagerRef.current.offerFileToSend(file);
      setFiles((prev) => [item, ...prev]);
    }
  };

  // Send Text
  const handleSendText = (text: string) => {
    if (!webrtcManagerRef.current) return;
    const item = webrtcManagerRef.current.sendTextMessage(text);
    setTexts((prev) => [item, ...prev]);
  };

  // Accept file
  const handleAcceptFile = (item: FileTransferItem) => {
    setIncomingOffer(null);
    webrtcManagerRef.current?.acceptIncomingFile(item);
  };

  // Reject file
  const handleRejectFile = (itemId: string) => {
    setIncomingOffer(null);
    webrtcManagerRef.current?.rejectIncomingFile(itemId);
    setFiles((prev) =>
      prev.map((f) => (f.id === itemId ? { ...f, state: 'cancelled' } : f))
    );
  };

  // Cancel file
  const handleCancelTransfer = (itemId: string) => {
    webrtcManagerRef.current?.cancelTransfer(itemId);
  };

  // Clear session history
  const handleClearHistory = () => {
    setFiles((prev) => prev.filter((f) => f.state === 'transferring' || f.state === 'preparing'));
  };

  // Loading indicator while checking authentication state
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-500 selection:text-white antialiased">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        connectionState={connectionState}
        peerDeviceInfo={peerDeviceInfo}
        sessionExpiresAt={session?.expiresAt}
        theme={theme}
        onToggleTheme={toggleTheme}
        onEndSession={session ? handleEndSession : undefined}
        hasActiveSession={!!session}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'auth' ? (
          <AuthView
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              setCurrentTab('transfer');
            }}
            onCancel={() => setCurrentTab('transfer')}
          />
        ) : currentTab === 'profile' ? (
          currentUser ? (
            <ProfileView
              user={currentUser}
              onUpdateUser={setCurrentUser}
              onLogout={handleLogout}
            />
          ) : (
            <AuthView
              onAuthSuccess={(user) => {
                setCurrentUser(user);
                setCurrentTab('profile');
              }}
              onCancel={() => setCurrentTab('transfer')}
            />
          )
        ) : currentTab === 'history' ? (
          <HistoryView
            files={files}
            onClearHistory={handleClearHistory}
          />
        ) : currentTab === 'privacy' ? (
          <PrivacyView />
        ) : currentTab === 'help' ? (
          <HelpView />
        ) : (
          /* Transfer Tab */
          <div>
            {/* 1. Landing View when Idle */}
            {connectionState === 'idle' && (
              <LandingView
                onStartSession={handleStartSession}
                onOpenJoin={() => setIsScannerOpen(true)}
                localDeviceInfo={localDeviceInfo}
                isCreating={isCreatingSession}
              />
            )}

            {/* 2. Pairing View when Host is waiting for Joiner */}
            {(connectionState === 'waiting' || (connectionState === 'creating' && session)) && session && (
              <div className="px-4 py-8">
                <PairingCard
                  session={session}
                  onRefresh={handleStartSession}
                  onCancel={handleEndSession}
                  theme={theme}
                />
              </div>
            )}

            {/* 3. Connecting State */}
            {connectionState === 'connecting' && (
              <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Establishing P2P WebRTC Connection...
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                  Negotiating direct DataChannel with {peerDeviceInfo?.name || 'peer'}
                </p>
              </div>
            )}

            {/* 4. Active Connected Dashboard */}
            {connectionState === 'connected' && (
              <TransferDashboard
                localDeviceInfo={localDeviceInfo}
                peerDeviceInfo={peerDeviceInfo}
                files={files}
                texts={texts}
                incomingOffer={incomingOffer}
                onSendFiles={handleSendFiles}
                onSendText={handleSendText}
                onAcceptFile={handleAcceptFile}
                onRejectFile={handleRejectFile}
                onCancelTransfer={handleCancelTransfer}
                autoAccept={autoAccept}
                onToggleAutoAccept={handleToggleAutoAccept}
              />
            )}

            {/* 5. Disconnected State */}
            {connectionState === 'disconnected' && (
              <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-rose-600 rounded-full" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Peer Connection Lost
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                  The remote device closed or refreshed their session.
                </p>
                <button
                  onClick={handleEndSession}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors"
                  id="restart-after-disconnect-btn"
                >
                  Start New Session
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* QR Code Camera Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(codeOrToken) => {
          handleJoinSession(codeOrToken).catch(() => {});
        }}
        onSwitchToManual={() => {
          setIsScannerOpen(false);
          setIsManualJoinOpen(true);
        }}
      />

      {/* Manual Code Input Modal */}
      <ManualJoinModal
        isOpen={isManualJoinOpen}
        onClose={() => setIsManualJoinOpen(false)}
        onSubmit={handleJoinSession}
        onSwitchToCamera={() => {
          setIsManualJoinOpen(false);
          setIsScannerOpen(true);
        }}
      />
    </div>
  );
}
