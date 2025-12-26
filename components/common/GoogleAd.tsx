
import React, { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG } from '../../config';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ slot, format = 'auto', className = '', label = 'Advertisement' }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ADSENSE_CONFIG.enabled && adRef.current) {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        // @ts-ignore
        adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  if (!ADSENSE_CONFIG.enabled) return null;

  return (
    <div className={`w-full flex justify-center items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative ${className}`} style={{ minHeight: '100px' }}>
       {/* Production Ad Unit */}
       <ins className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={ADSENSE_CONFIG.clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        
        {/* Placeholder Visual (Visible if AdBlock is on or ID is invalid in Dev) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40 z-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">{label}</span>
        </div>
    </div>
  );
};
