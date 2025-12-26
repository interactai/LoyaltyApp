
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Camera, Zap, Image as ImageIcon, RotateCcw, AlertTriangle, Play } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QRScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    setCameraStarted(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera(); 
    setHasPermission(null);
    setErrorMessage('');
    
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Camera API not supported in this browser");
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        streamRef.current = mediaStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play().catch(e => console.log("Video play error:", e));
        }
        setHasPermission(true);
        setCameraStarted(true);
    } catch (err: any) {
        console.error("Camera Error:", err);
        setHasPermission(false);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setErrorMessage(t.cameraPermissionDenied || 'Permission denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setErrorMessage(t.cameraNotFound || 'No camera found on this device.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            setErrorMessage(t.cameraInUse || 'Camera is already in use by another application.');
        } else {
            setErrorMessage(t.cameraError || err.message || 'Unable to access camera.');
        }
    }
  }, [t, stopCamera]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleSimulateScan = () => {
      if (simulatedCode) {
          onScan(simulatedCode.toUpperCase());
      }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={onClose} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                <X className="w-6 h-6" />
            </button>
            <div className="flex gap-4">
                {cameraStarted && (
                    <button className="p-2 text-white/80 hover:text-white transition-colors">
                        <Zap className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative bg-gray-950 flex items-center justify-center overflow-hidden">
            {!cameraStarted ? (
                <div className="text-center p-8 text-white max-w-xs z-10">
                    <div className="w-20 h-20 bg-orange-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
                        <Camera className="w-10 h-10 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Ready to Scan?</h3>
                    <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                        We need your camera permission to scan product QR stickers and add points to your wallet.
                    </p>
                    <button 
                        onClick={startCamera}
                        className="flex items-center justify-center w-full py-4 bg-orange-600 rounded-2xl font-black text-sm shadow-xl shadow-orange-900/20 active:scale-95 transition-all hover:bg-orange-500"
                    >
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        OPEN CAMERA
                    </button>
                </div>
            ) : hasPermission === false ? (
                <div className="text-center p-6 text-white max-w-xs z-10">
                    <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="font-bold mb-2 text-lg">Permission Required</p>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">{errorMessage}</p>
                    <button 
                        onClick={startCamera}
                        className="flex items-center justify-center w-full py-3.5 bg-white text-black rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        TRY AGAIN
                    </button>
                </div>
            ) : (
                <>
                    <video 
                        ref={videoRef} 
                        playsInline 
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Scanning Overlay Frame */}
                    <div className="relative w-64 h-64 border-2 border-orange-500/50 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] z-10 flex items-center justify-center pointer-events-none">
                         <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-orange-500 -ml-1 -mt-1 rounded-tl-xl"></div>
                         <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-orange-500 -mr-1 -mt-1 rounded-tr-xl"></div>
                         <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-orange-500 -ml-1 -mb-1 rounded-bl-xl"></div>
                         <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-orange-500 -mr-1 -mb-1 rounded-br-xl"></div>
                         
                         {/* Scan Animation Line */}
                         <div className="w-full h-1 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] absolute top-0 animate-[scan_2.5s_ease-in-out_infinite]"></div>
                    </div>
                </>
            )}
            
            {/* Background Texture for empty state */}
            {!cameraStarted && (
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:20px_20px]"></div>
                </div>
            )}
        </div>

        {/* Footer Controls */}
        <div className="p-6 bg-gray-950 text-white pb-safe border-t border-white/5">
            {cameraStarted ? (
                <p className="text-center text-xs font-bold uppercase tracking-widest mb-6 text-gray-500">Align QR code within the frame</p>
            ) : (
                <p className="text-center text-xs font-bold uppercase tracking-widest mb-6 text-gray-600">Permissions are requested only when you scan</p>
            )}
            
            {/* Simulation Input for Demo Purposes */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <p className="text-[10px] uppercase font-black text-gray-500 mb-3 tracking-widest">Manual Code Entry</p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={simulatedCode}
                        onChange={(e) => setSimulatedCode(e.target.value)}
                        placeholder="VISTA-XXXX"
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-white text-sm font-bold placeholder:text-gray-700 outline-none focus:border-orange-500/50"
                    />
                    <button 
                        onClick={handleSimulateScan}
                        disabled={!simulatedCode}
                        className="px-6 py-2 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-20 transition-all active:scale-95"
                    >
                        SUBMIT
                    </button>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                 <button className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors group">
                     <div className="w-12 h-12 bg-white/5 group-hover:bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                         <ImageIcon className="w-5 h-5" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-tighter">Gallery</span>
                 </button>
            </div>
        </div>

        <style>{`
            @keyframes scan {
                0% { top: 0%; opacity: 0.2; }
                50% { opacity: 1; }
                100% { top: 100%; opacity: 0.2; }
            }
        `}</style>
    </div>
  );
};
