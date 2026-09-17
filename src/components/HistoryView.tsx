import React from 'react';
import { 
  History, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Download,
  File
} from 'lucide-react';
import { FileTransferItem } from '../types.ts';
import { formatBytes } from '../lib/crypto.ts';

interface HistoryViewProps {
  files: FileTransferItem[];
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  files,
  onClearHistory,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Session Transfer History</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            History is ephemeral and strictly scoped to your current session.
          </p>
        </div>

        {files.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors"
            id="clear-history-btn"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Content */}
      {files.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mx-auto flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
            No transfers in this session yet
          </div>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Once you send or receive files, their transfer metrics and SHA-256 verification records will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-zinc-200 dark:divide-zinc-800">
          {files.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0 mt-0.5">
                  <File className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {item.name}
                    </span>
                    {item.isIncoming ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-medium">
                        <ArrowDownLeft className="w-3 h-3" /> Received
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-medium">
                        <ArrowUpRight className="w-3 h-3" /> Sent
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-2 mt-0.5">
                    <span>{formatBytes(item.size)}</span>
                    {item.endTime && (
                      <>
                        <span>•</span>
                        <span>{new Date(item.endTime).toLocaleTimeString()}</span>
                      </>
                    )}
                    {item.sha256 && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[140px] sm:max-w-xs">
                          SHA-256: {item.sha256.substring(0, 12)}...
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and download */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {item.state === 'completed' && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                    {item.blobUrl && (
                      <a
                        href={item.blobUrl}
                        download={item.name}
                        className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {item.state === 'failed' && (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    <span>Failed</span>
                  </span>
                )}

                {item.state === 'cancelled' && (
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500 font-medium">
                    <XCircle className="w-4 h-4" />
                    <span>Cancelled</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
