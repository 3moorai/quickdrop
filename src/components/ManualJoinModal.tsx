import React, { useState } from 'react';
import { KeyRound, X, Camera, ArrowRight, AlertCircle } from 'lucide-react';

interface ManualJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (codeOrUrl: string) => Promise<void>;
  onSwitchToCamera: () => void;
}

export const ManualJoinModal: React.FC<ManualJoinModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSwitchToCamera,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputValue.trim();
    if (!clean) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit(clean);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect. Please check the code and try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (errorMessage) setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
              Join QuickDrop Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
            id="close-manual-join-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Pairing Code or Join Link
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="e.g. QK-7F92-XK31 or paste link"
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              autoFocus
              id="manual-code-input"
            />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Enter the 8-character pairing code shown on the sender screen.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={!inputValue.trim() || isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              id="submit-manual-code-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>Connect to Device</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onSwitchToCamera}
              className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors flex items-center justify-center gap-2"
              id="switch-to-camera-btn"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan QR Code with Camera Instead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
