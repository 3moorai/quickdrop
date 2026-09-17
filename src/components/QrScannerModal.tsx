import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, X, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (tokenOrCode: string) => void;
  onSwitchToManual: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  onSwitchToManual,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(true);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsStartingCamera(true);
    setCameraError(null);
    setScanMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser environment');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsStartingCamera(false);
        scanLoop();
      }
    } catch (err: any) {
      setIsStartingCamera(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera was detected on this device.');
      } else {
        setCameraError(err.message || 'Unable to start camera.');
      }
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const scanLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      const text = code.data.trim();
      let matchedTokenOrCode: string | null = null;

      // Check if URL with ?join=token
      try {
        const url = new URL(text);
        const joinParam = url.searchParams.get('join');
        if (joinParam) {
          matchedTokenOrCode = joinParam;
        }
      } catch {
        // Not a URL, check if code format QK-XXXX-XXXX
        if (/^QK-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(text)) {
          matchedTokenOrCode = text.toUpperCase();
        }
      }

      if (matchedTokenOrCode) {
        stopCamera();
        onScanSuccess(matchedTokenOrCode);
        return;
      } else {
        setScanMessage('This QR code is not a valid QuickDrop pairing code.');
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanLoop);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
              Scan QuickDrop QR Code
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
            id="close-qr-scanner-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video / Camera Box */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanner Reticle Overlay */}
          {!cameraError && !isStartingCamera && (
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 border-2 border-blue-500/70 rounded-2xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-blue-400 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-blue-400 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-blue-400 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-blue-400 rounded-br" />
              {/* Laser scanning line */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse shadow-sm" />
            </div>
          )}

          {isStartingCamera && !cameraError && (
            <div className="flex flex-col items-center gap-2 text-zinc-400 text-xs z-10">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              <span>Starting camera preview...</span>
            </div>
          )}

          {cameraError && (
            <div className="p-6 text-center space-y-3 z-10">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto">
                {cameraError}
              </p>
              <button
                onClick={onSwitchToManual}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                id="scanner-switch-manual-btn"
              >
                Enter Code Manually Instead
              </button>
            </div>
          )}
        </div>

        {scanMessage && (
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs text-center">
            {scanMessage}
          </div>
        )}

        {/* Fallback to Manual Code Entry */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={onSwitchToManual}
            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            id="scanner-manual-fallback-btn"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Have a pairing code? Enter manually</span>
          </button>

          <button
            onClick={startCamera}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs"
            title="Restart Camera"
            id="scanner-restart-cam-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
