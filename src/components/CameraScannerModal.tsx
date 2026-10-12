import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useApp } from '../context/AppContext';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({ isOpen, onClose }) => {
  const { scanPassEntry } = useApp();
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    setIsInitializing(true);
    setScannerError(null);
    setLastScannedCode(null);

    const elementId = 'vip-qr-camera-stream';

    const startScanner = async () => {
      try {
        // Wait a tick for DOM element to render
        await new Promise((resolve) => setTimeout(resolve, 200));

        const qrScanner = new Html5Qrcode(elementId);
        html5QrCodeRef.current = qrScanner;

        const config = {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        };

        await qrScanner.start(
          { facingMode: 'environment' },
          config,
          async (decodedText) => {
            if (isScanningRef.current) return;
            isScanningRef.current = true;

            // Extract pass ID if decodedText is a URL
            let extractedPassId = decodedText.trim();
            try {
              if (extractedPassId.includes('?scan_pass=') || extractedPassId.includes('&scan_pass=')) {
                const url = new URL(extractedPassId);
                const queryId = url.searchParams.get('scan_pass');
                if (queryId) extractedPassId = queryId;
              } else if (extractedPassId.includes('scan_pass=')) {
                const match = extractedPassId.match(/scan_pass=([^&]+)/);
                if (match && match[1]) extractedPassId = match[1];
              }
            } catch {
              // Not a standard URL, keep raw string
            }

            setLastScannedCode(extractedPassId);

            // Audio feedback beep
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.setValueAtTime(880, ctx.currentTime);
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              osc.start();
              osc.stop(ctx.currentTime + 0.15);
            } catch {
              // Audio context not available or blocked, proceed silently
            }

            // Stop scanner & process entry
            try {
              await qrScanner.stop();
            } catch {
              // ignore stop errors
            }

            onClose();
            await scanPassEntry(extractedPassId);
          },
          () => {
            // Frame scan callback without match - silent ignore
          }
        );

        setIsInitializing(false);
      } catch (err: any) {
        console.error('Camera QR scanner error:', err);
        setScannerError(
          err?.message || 'Unable to access device camera. Please check camera permissions in your browser.'
        );
        setIsInitializing(false);
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current
            .stop()
            .catch(() => {})
            .finally(() => {
              try {
                html5QrCodeRef.current?.clear();
              } catch {
                // ignore
              }
            });
        } catch {
          // ignore
        }
      }
      isScanningRef.current = false;
    };
  }, [isOpen, onClose, scanPassEntry]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border-2 border-[#D4AF37] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white">
        
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#7D0000] via-[#A81020] to-[#5C0000] flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/20 rounded-xl border border-amber-400/40">
              <Camera className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-[#FFD700] tracking-wide">
                VIP Pass Live Camera Scanner
              </h3>
              <p className="text-[11px] text-amber-200/80">Point camera at printed QR code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="p-4 flex flex-col items-center justify-center min-h-[340px] bg-black/60 relative">
          
          {isInitializing && !scannerError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-900/90 gap-3">
              <RefreshCw className="w-8 h-8 text-[#FFD700] animate-spin" />
              <p className="text-xs text-amber-200 font-bold">Activating device camera...</p>
            </div>
          )}

          {scannerError ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-900/40 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-red-300 font-semibold">{scannerError}</p>
              <div className="text-[11px] text-stone-400 space-y-1">
                <p>• Make sure camera access is allowed in your browser settings.</p>
                <p>• On HTTPS/localhost, tap "Allow" when prompted for camera permission.</p>
                <p>• Or scan the QR code with your standard phone camera app directly!</p>
              </div>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-bold rounded-xl text-amber-300 border border-amber-500/30"
              >
                Close Scanner
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div
                id="vip-qr-camera-stream"
                className="w-full max-w-[320px] rounded-2xl overflow-hidden border border-amber-500/40 shadow-inner bg-black"
              />

              {lastScannedCode && (
                <div className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-900/70 border border-emerald-500 text-emerald-200 text-xs font-mono font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Detected: {lastScannedCode}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Guidance */}
        <div className="p-3 bg-stone-950/80 border-t border-stone-800 text-center">
          <p className="text-[11px] text-amber-200/70 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Align QR code inside square box • Automatically writes entry to DB</span>
          </p>
        </div>

      </div>
    </div>
  );
};
