
import React, { useState, useEffect } from 'react';
import { X, Printer, Award, Gift, LayoutGrid, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { LoyaltyBatch } from '../../types';
import { BRAND_CONFIG } from '../../config';
import { useSettings } from '../../contexts/SettingsContext';

interface StickerPreviewModalProps {
  batch: LoyaltyBatch;
  isOpen: boolean;
  onClose: () => void;
  onPrint: (density: number) => void;
}

export const StickerPreviewModal: React.FC<StickerPreviewModalProps> = ({ batch, isOpen, onClose, onPrint }) => {
  const { settings } = useSettings();
  const [density, setDensity] = useState(30);
  const [scale, setScale] = useState(0.85); // Increased default scale for better visibility

  // Auto-fit logic on mount
  useEffect(() => {
    if (isOpen) {
        const handleResize = () => {
            const availableHeight = window.innerHeight - 150;
            const sheetHeightPx = 1122; // approx 297mm at 96dpi
            const fitScale = Math.min(1.2, availableHeight / sheetHeightPx);
            setScale(Math.max(0.6, fitScale));
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getLayout = (d: number) => {
    switch (d) {
      case 10: return { grid: 'grid-cols-2 gap-8', height: 'h-[5.4cm]', text: 'text-5xl', subtext: 'text-sm', qrSize: '120' };
      case 20: return { grid: 'grid-cols-4 gap-4', height: 'h-[5cm]', text: 'text-2xl', subtext: 'text-[10px]', qrSize: '100' };
      case 30: return { grid: 'grid-cols-3 gap-2', height: 'h-[2.8cm]', text: 'text-xl', subtext: 'text-[9px]', qrSize: '80' };
      default: return { grid: 'grid-cols-3 gap-4', height: 'h-[3.6cm]', text: 'text-3xl', subtext: 'text-xs', qrSize: '90' };
    }
  };

  const layout = getLayout(density);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vistaengage.com';

  const brandName = settings.qrBrandName || BRAND_CONFIG.appName;
  const mysteryText = settings.qrMysteryText || 'Mystery Reward';
  const scanText = settings.qrScanText || 'Scan to Reveal';

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-md flex flex-col animate-fade-in overflow-hidden">
        {/* Expanded Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shrink-0 shadow-sm z-20">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-orange-50 rounded-xl">
                    <Printer className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Print Sticker Batch</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">{batch.id}</span>
                        <span className="text-xs text-gray-400 font-medium">{batch.name}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    <button 
                        onClick={() => setScale(Math.max(0.4, scale - 0.1))} 
                        className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="min-w-[50px] text-center text-[11px] font-black text-gray-900 uppercase">
                        {Math.round(scale * 100)}%
                    </span>
                    <button 
                        onClick={() => setScale(Math.min(2, scale + 0.1))} 
                        className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button 
                        onClick={() => setScale(0.85)} 
                        className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all"
                        title="Reset Zoom"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>

                <button 
                    onClick={onClose} 
                    className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Optimized Sidebar Controls */}
            <div className="w-72 bg-white border-r border-gray-100 p-8 flex flex-col overflow-y-auto shrink-0 z-10 shadow-lg">
                <div className="mb-10">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Page Layout</h3>
                    <div className="space-y-4">
                        {[10, 20, 30].map(d => (
                            <button 
                                key={d} 
                                onClick={() => setDensity(d)} 
                                className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all ${density === d ? 'border-orange-500 bg-orange-50/30 ring-4 ring-orange-500/5' : 'border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-200'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${density === d ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 shadow-sm'}`}>
                                    <LayoutGrid className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <span className={`block text-sm font-black ${density === d ? 'text-gray-900' : 'text-gray-500'}`}>{d} Pcs</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Per Sheet</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-8">
                    <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2">Print Tip</p>
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">Use self-adhesive A4 sheets. Ensure browser margin is set to 'None' for perfect alignment.</p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <button 
                        onClick={() => onPrint(density)} 
                        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Printer className="w-5 h-5" />
                        Print Now
                    </button>
                </div>
            </div>

            {/* Expansive Preview Area */}
            <div className="flex-1 bg-gray-100 overflow-auto p-12 lg:p-20 flex justify-center items-start custom-scrollbar">
                <div 
                    className="bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-transform origin-top duration-300" 
                    style={{ 
                        width: '210mm', 
                        minHeight: '297mm', 
                        padding: '1.2cm', 
                        transform: `scale(${scale})`
                    }}
                >
                    <div className={`grid ${layout.grid} content-start`}>
                        {batch.codes.map((card) => {
                            const qrData = `${baseUrl}?code=${card.code}`;
                            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&color=000000&bgcolor=ffffff&margin=0`;

                            return (
                                <div key={card.id} className={`border border-gray-900 rounded-lg p-3 flex items-center justify-between ${layout.height} relative overflow-hidden group`}>
                                    <div className="flex flex-col items-start justify-center h-full pl-2 z-10 flex-1">
                                        <div className="flex items-center gap-1 opacity-70 mb-1">
                                            <Award className="w-3.5 h-3.5" />
                                            <span className="text-[8px] font-black uppercase tracking-[0.1em]">{brandName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-black my-1">
                                            <Gift className="w-6 h-6" />
                                            <h2 className={`${layout.text} font-black leading-none tracking-tighter`}>?</h2>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-800">{mysteryText}</span>
                                        <div className="mt-3 bg-gray-900 text-white px-2 py-1 rounded text-[10px] font-mono font-black tracking-widest">
                                            {card.code}
                                        </div>
                                    </div>
                                    <div className="pr-1 z-10 flex flex-col items-center">
                                        <div className="p-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                                            <img 
                                                src={qrUrl} 
                                                alt="QR" 
                                                className="mix-blend-multiply"
                                                style={{ width: `${layout.qrSize}px`, height: `${layout.qrSize}px` }}
                                            />
                                        </div>
                                        <span className="text-[7px] font-black uppercase mt-1.5 text-gray-400 tracking-[0.1em]">{scanText}</span>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-black transform -rotate-12 pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                                        <Award size={120} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
        
        <style>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.05);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.1);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(0,0,0,0.2);
            }
        `}</style>
    </div>
  );
};
