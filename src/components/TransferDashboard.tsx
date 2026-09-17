import React, { useRef, useState, useEffect } from 'react';
import { 
  UploadCloud, 
  File, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Music, 
  Archive, 
  Download, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  ExternalLink, 
  Laptop, 
  Smartphone, 
  FolderUp, 
  Camera, 
  Clock, 
  ShieldCheck, 
  Zap,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { DeviceInfo, FileTransferItem, TextTransferItem } from '../types.ts';
import { formatBytes, formatSpeed, formatEta, isValidUrl } from '../lib/crypto.ts';

interface TransferDashboardProps {
  localDeviceInfo: DeviceInfo;
  peerDeviceInfo?: DeviceInfo;
  files: FileTransferItem[];
  texts: TextTransferItem[];
  incomingOffer: FileTransferItem | null;
  onSendFiles: (files: FileList | File[]) => void;
  onSendText: (text: string) => void;
  onAcceptFile: (item: FileTransferItem) => void;
  onRejectFile: (itemId: string) => void;
  onCancelTransfer: (itemId: string) => void;
  autoAccept: boolean;
  onToggleAutoAccept: (value: boolean) => void;
}

export const TransferDashboard: React.FC<TransferDashboardProps> = ({
  localDeviceInfo,
  peerDeviceInfo,
  files,
  texts,
  incomingOffer,
  onSendFiles,
  onSendText,
  onAcceptFile,
  onRejectFile,
  onCancelTransfer,
  autoAccept,
  onToggleAutoAccept,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'files' | 'text'>('files');
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Folder support detection
  const isFolderSupported = typeof window !== 'undefined' && 'webkitdirectory' in document.createElement('input');

  // Drag and drop listeners on window
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsDraggingOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDraggingOver(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingOver(false);
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onSendFiles(e.dataTransfer.files);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [onSendFiles]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onSendText(textInput.trim());
    setTextInput('');
  };

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTextId(id);
      setTimeout(() => setCopiedTextId(null), 2000);
    } catch {}
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (mimeType.startsWith('video/')) return <Film className="w-5 h-5 text-purple-500" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-5 h-5 text-pink-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar') || mimeType.includes('compressed')) {
      return <Archive className="w-5 h-5 text-amber-500" />;
    }
    return <File className="w-5 h-5 text-zinc-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Global Drag Overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 bg-blue-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white pointer-events-none animate-in fade-in duration-150">
          <UploadCloud className="w-20 h-20 animate-bounce mb-4" />
          <h2 className="text-3xl font-extrabold tracking-tight">Drop files to send</h2>
          <p className="text-blue-100 text-sm mt-2">
            Files will stream directly to {peerDeviceInfo?.name || 'peer'} via WebRTC
          </p>
        </div>
      )}

      {/* Connected Devices Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            {peerDeviceInfo?.type === 'mobile' ? (
              <Smartphone className="w-5 h-5" />
            ) : (
              <Laptop className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Connected to</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {peerDeviceInfo?.name || 'Connected Peer'}
            </h2>
          </div>
        </div>

        {/* Auto-accept Toggle */}
        <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoAccept}
            onChange={(e) => onToggleAutoAccept(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            id="auto-accept-checkbox"
          />
          <span>Auto-accept incoming files from this device</span>
        </label>
      </div>

      {/* Incoming File Prompt Dialog */}
      {incomingOffer && !autoAccept && (
        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                {getFileIcon(incomingOffer.type)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Incoming Transfer
                  </span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    from {peerDeviceInfo?.name || 'peer'}
                  </span>
                </div>
                <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-sm">
                  {incomingOffer.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatBytes(incomingOffer.size)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onRejectFile(incomingOffer.id)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                id="reject-incoming-file-btn"
              >
                Decline
              </button>
              <button
                onClick={() => onAcceptFile(incomingOffer)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                id="accept-incoming-file-btn"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Accept & Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main SubTabs (Files vs Text) */}
      <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 gap-6">
        <button
          onClick={() => setActiveSubTab('files')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeSubTab === 'files'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
          id="tab-files-toggle"
        >
          <span>Send Files & Media</span>
          {activeSubTab === 'files' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('text')}
          className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-1.5 ${
            activeSubTab === 'text'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
          id="tab-text-toggle"
        >
          <span>Text & Links</span>
          {texts.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
              {texts.length}
            </span>
          )}
          {activeSubTab === 'text' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
          )}
        </button>
      </div>

      {/* SubTab Content: Files */}
      {activeSubTab === 'files' && (
        <div className="space-y-6">
          {/* Dropzone Card */}
          <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-zinc-900/50 text-center transition-colors">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Drop files here
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Transfers directly over WebRTC without passing through cloud storage
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                {/* Select Files */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors flex items-center gap-1.5 focus:outline-none"
                  id="select-files-btn"
                >
                  <File className="w-3.5 h-3.5" />
                  <span>Select Files</span>
                </button>

                {/* Send Photos / Images */}
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 focus:outline-none"
                  id="select-images-btn"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Photos</span>
                </button>

                {/* Folder Upload where supported */}
                {isFolderSupported && (
                  <button
                    onClick={() => folderInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 focus:outline-none"
                    id="select-folder-btn"
                  >
                    <FolderUp className="w-3.5 h-3.5 text-amber-500" />
                    <span>Folder</span>
                  </button>
                )}
              </div>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onSendFiles(e.target.files);
                    e.target.value = '';
                  }
                }}
              />
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onSendFiles(e.target.files);
                    e.target.value = '';
                  }
                }}
              />
              {isFolderSupported && (
                <input
                  ref={folderInputRef}
                  type="file"
                  multiple
                  // @ts-expect-error webkitdirectory is non-standard but widely supported
                  webkitdirectory=""
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onSendFiles(e.target.files);
                      e.target.value = '';
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Transfers Queue */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Transfers ({files.length})
              </h4>

              <div className="space-y-2.5">
                {files.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-3"
                  >
                    {/* Top row: Icon, Name, Size, Status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                          {getFileIcon(item.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-xs sm:max-w-md">
                              {item.name}
                            </span>
                            {item.isIncoming ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">
                                <ArrowDownLeft className="w-3 h-3" /> Received
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                                <ArrowUpRight className="w-3 h-3" /> Sent
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                            <span>{formatBytes(item.size)}</span>
                            {item.state === 'transferring' && (
                              <>
                                <span>•</span>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  {formatSpeed(item.speed)}
                                </span>
                                <span>•</span>
                                <span>{formatEta(item.eta)} remaining</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action / Status Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.state === 'completed' && (
                          <div className="flex items-center gap-2">
                            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verified</span>
                            </span>
                            {item.blobUrl && (
                              <a
                                href={item.blobUrl}
                                download={item.name}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                              >
                                <Download className="w-3 h-3" />
                                <span>Save</span>
                              </a>
                            )}
                          </div>
                        )}

                        {item.state === 'transferring' && (
                          <button
                            onClick={() => onCancelTransfer(item.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Cancel Transfer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {item.state === 'failed' && (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Failed</span>
                          </span>
                        )}

                        {item.state === 'cancelled' && (
                          <span className="text-xs text-zinc-500">Cancelled</span>
                        )}

                        {item.state === 'verifying' && (
                          <span className="text-xs text-amber-500 animate-pulse">Verifying hash...</span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Active Transfer */}
                    {(item.state === 'transferring' || item.state === 'preparing' || item.state === 'verifying') && (
                      <div className="space-y-1.5">
                        <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-200"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                          <span>{formatBytes(item.transferredBytes)} / {formatBytes(item.size)}</span>
                          <span>{item.progress}%</span>
                        </div>
                      </div>
                    )}

                    {/* SHA-256 Checksum pill */}
                    {item.sha256 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono truncate pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">SHA-256: {item.sha256}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SubTab Content: Text & Links */}
      {activeSubTab === 'text' && (
        <div className="space-y-6">
          {/* Text Compose Card */}
          <form onSubmit={handleTextSubmit} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Send Text, Code, or URL
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste anything here: notes, links, code snippets..."
              rows={3}
              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans"
              id="text-message-textarea"
            />

            <div className="flex items-center justify-between">
              {isValidUrl(textInput) ? (
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Valid Link detected</span>
                </div>
              ) : (
                <span className="text-xs text-zinc-400">Instant direct transfer</span>
              )}

              <button
                type="submit"
                disabled={!textInput.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                id="send-text-btn"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>

          {/* Texts Stream */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Shared Texts ({texts.length})
            </h4>

            {texts.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
                No text messages sent or received in this session yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {texts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {item.isIncoming ? (
                          <span className="text-cyan-600 dark:text-cyan-400">Received from {peerDeviceInfo?.name || 'peer'}</span>
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400">Sent by this device</span>
                        )}
                      </span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-mono break-all p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 select-text">
                      {item.text}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {item.isUrl && (
                        <a
                          href={item.text}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open Link</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleCopyText(item.id, item.text)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        {copiedTextId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
