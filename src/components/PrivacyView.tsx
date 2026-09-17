import React from 'react';
import { ShieldCheck, Lock, Server, EyeOff, KeyRound, Cpu, CheckCircle } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy & Security Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          How QuickDrop Protects Your Data
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          QuickDrop was built with a privacy-first foundation. We believe file sharing should be direct, ephemeral, and free from third-party storage.
        </p>
      </div>

      {/* Official Architecture Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-semibold text-sm">
          <Lock className="w-4 h-4" />
          <span>Core Privacy Guarantee</span>
        </div>
        <p className="text-xs sm:text-sm text-blue-800/90 dark:text-blue-300/90 leading-relaxed">
          QuickDrop does not store your files on our servers. Transfers use encrypted WebRTC connections. In some restrictive network conditions, WebRTC may use an encrypted relay server (TURN) to establish connectivity, but your file data is never saved or retained.
        </p>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            Signaling vs. File Data Separation
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The signaling server only coordinates connection setup (SDP exchange, ICE candidates, and temporary tokens). File binary data is strictly blocked from the signaling channel and travels only through the direct WebRTC DataChannel.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            End-to-End DTLS Encryption
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            All WebRTC DataChannels are encrypted by standard using Datagram Transport Layer Security (DTLS). Data is encrypted on the sender's device and decrypted only on the receiver's device.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            Ephemeral Pairing Tokens
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Pairing tokens are generated using cryptographically secure random bytes. Sessions expire automatically after 15 minutes or when either peer ends the session.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
            <EyeOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            Zero Tracking & Zero Accounts
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            No registration, phone number, or email required. We don't employ persistent device fingerprinting, tracking pixels, or user activity profilers.
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          What QuickDrop Collects & Retains
        </h3>
        <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>File Contents:</strong> Never stored or logged on any server.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>File Names & Metadata:</strong> Handled in browser memory only during active session.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>Session Identifiers:</strong> In-memory ephemeral records on the signaling server, destroyed upon expiry.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>Device Names:</strong> Temporary browser and OS labels (e.g., "Chrome on macOS") for peer recognition only.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
