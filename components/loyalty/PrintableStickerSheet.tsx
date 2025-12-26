
import React from 'react';
import { Award, Gift } from 'lucide-react';
import { LoyaltyBatch } from '../../types';
import { BRAND_CONFIG } from '../../config';
import { useSettings } from '../../contexts/SettingsContext';

interface PrintableStickerSheetProps {
  batch: LoyaltyBatch | null;
  density: number;
}

export const PrintableStickerSheet: React.FC<PrintableStickerSheetProps> = ({ batch, density }) => {
  const { settings } = useSettings();
  
  if (!batch) return null;

  const getLayout = (d: number) => {
    switch (d) {
      case 10: return { grid: 'grid-cols-2 gap-8', height: 'h-[5.4cm]', text: 'text-5xl', subtext: 'text-sm', qrSize: '120' };
      case 20: return { grid: 'grid-cols-4 gap-4', height: 'h-[5cm]', text: 'text-2xl', subtext: 'text-[10px]', qrSize: '100' };
      case 30: return { grid: 'grid-cols-3 gap-2', height: 'h-[2.8cm]', text: 'text-xl', subtext: 'text-[9px]', qrSize: '80' };
      default: return { grid: 'grid-cols-3 gap-4', height: 'h-[3.6cm]', text: 'text-3xl', subtext: 'text-xs', qrSize: '90' };
    }
  };

  const layout = getLayout(density);
  
  // Custom Labels from Settings
  const brandName = settings.qrBrandName || BRAND_CONFIG.appName;
  const mysteryText = settings.qrMysteryText || 'Mystery Reward';
  const scanText = settings.qrScanText || 'Scan to Reveal';

  // Base URL for the QR code to redirect to (e.g. https://myapp.com?code=XYZ)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vistaengage.com';

  return (
    <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-0 m-0 overflow-visible text-black">
      <style>{`
        @media print {
          @page { margin: 1cm; size: A4; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className={`print-area grid ${layout.grid} content-start`}>
        {batch.codes.map((card) => {
          // Generate a functional QR code using a public API
          const qrData = `${baseUrl}?code=${card.code}`;
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&color=000000&bgcolor=ffffff&margin=0`;

          return (
            <div key={card.id} className={`border border-black rounded-lg p-2 flex items-center justify-between ${layout.height} break-inside-avoid page-break-inside-avoid relative overflow-hidden`}>
               {/* Left Side: Branding & Value */}
               <div className="flex flex-col items-start justify-center h-full pl-2 z-10 flex-1">
                  <div className="flex items-center gap-1 opacity-60 mb-1">
                      <Award className="w-3 h-3" />
                      <span className="text-[8px] font-bold uppercase tracking-wider">{brandName}</span>
                  </div>
                  
                  {/* Hidden Value - Surprise Mode */}
                  <div className="flex items-center gap-2 text-black">
                      <Gift className="w-6 h-6" />
                      <h2 className={`${layout.text} font-black leading-none tracking-tighter`}>?</h2>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">{mysteryText}</span>
                  
                  <div className="mt-2 bg-black text-white px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                    {card.code}
                  </div>
               </div>

               {/* Right Side: The Generated QR */}
               <div className="pr-1 z-10 flex flex-col items-center">
                  <img 
                    src={qrUrl} 
                    alt="Scan" 
                    className="mix-blend-multiply"
                    style={{ width: `${layout.qrSize}px`, height: `${layout.qrSize}px` }}
                  />
                  <span className="text-[8px] font-bold uppercase mt-1 text-gray-500">{scanText}</span>
               </div>
               
               {/* Background Watermark */}
               <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-black transform -rotate-12 pointer-events-none">
                  <Award size={100} />
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
