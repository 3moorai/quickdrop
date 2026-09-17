import React from 'react';
import { 
  ArrowRight, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Laptop, 
  Share2,
  FileCheck2,
  Lock
} from 'lucide-react';
import { DeviceInfo } from '../types.ts';

interface LandingViewProps {
  onStartSession: () => void;
  onOpenJoin: () => void;
  localDeviceInfo: DeviceInfo;
  isCreating: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartSession,
  onOpenJoin,
  localDeviceInfo,
  isCreating,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Private Encrypted WebRTC DataChannel</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Move files. <span className="text-blue-600 dark:text-blue-400">Not through the cloud.</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Fast, direct cross-device transfers between iOS, Android, Windows, Mac, and Linux. 
          No accounts, no cloud storage, no size limits.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartSession}
            disabled={isCreating}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none"
            id="start-transfer-btn"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Session...</span>
              </>
            ) : (
              <>
                <span>Start New Transfer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          <button
            onClick={onOpenJoin}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-sm transition-all flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
            id="join-session-btn"
          >
            <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Join with Code / Scan QR</span>
          </button>
        </div>

        {/* Current Device Identifier Pill */}
        <div className="pt-2">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            This device: <span className="text-zinc-700 dark:text-zinc-200 font-semibold">{localDeviceInfo.name}</span>
          </span>
        </div>
      </div>

      {/* Step Visual Process */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Create Session</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Generate an ephemeral session with a high-contrast QR code.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Scan or Pair</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Scan the QR code with your phone camera or enter the 8-char code.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">WebRTC P2P</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Direct peer-to-peer data channel is negotiated instantly.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            4
          </div>
          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Stream & Verify</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Files stream chunk by chunk with SHA-256 integrity verification.
          </div>
        </div>
      </div>

      {/* Trust & Architecture Points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 h-fit">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Zero Cloud Storage</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Files stream straight between device memories. No servers retain your files.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 h-fit">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Direct WebRTC Speed</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              When devices share a local Wi-Fi, data travels directly over your LAN with zero bottleneck.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 h-fit">
            <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">SHA-256 Verified</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Every transferred payload is mathematically verified before being saved to ensure zero corruption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
