
import React from 'react';
import { Download, X, AppWindow, Smartphone } from 'lucide-react';
import { usePWA } from '../contexts/PWAContext';

export const PWAInstallPrompt: React.FC = () => {
  const { showPrompt, installApp, dismissPrompt } = usePWA();

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-4 right-4 z-[200] animate-slide-up max-w-lg mx-auto">
      <div className="bg-orange-600 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-gray-950 p-5 relative overflow-hidden">
        {/* Decorative caution stripes */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-950 opacity-20 flex">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex-1 h-full bg-white transform -skew-x-45 mx-1"></div>
          ))}
        </div>

        <div className="flex items-start gap-4 mt-2">
          <div className="w-14 h-14 bg-gray-950 rounded flex items-center justify-center shrink-0 border-2 border-orange-500 shadow-lg">
            <AppWindow className="w-8 h-8 text-orange-500" strokeWidth={3} />
          </div>
          
          <div className="flex-1 pr-6">
            <h3 className="text-gray-950 font-black text-sm uppercase tracking-tighter leading-tight">
              INSTALL INDUSTRIAL APP
            </h3>
            <p className="text-gray-950 text-[10px] font-black uppercase tracking-widest mt-1 opacity-80 leading-none">
              OFFLINE ACCESS • FASTER LOAD • PUSH ALERTS
            </p>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={installApp}
                className="bg-gray-950 text-white px-5 py-2 rounded font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:translate-y-1 transition-all flex items-center gap-2 border-b-4 border-gray-800"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={3} />
                INSTALL NOW
              </button>
              <button 
                onClick={dismissPrompt}
                className="bg-white/20 text-gray-950 px-4 py-2 rounded font-black text-[10px] uppercase tracking-widest hover:bg-white/30 transition-colors"
              >
                LATER
              </button>
            </div>
          </div>

          <button 
            onClick={dismissPrompt}
            className="absolute top-4 right-4 text-gray-950 hover:scale-110 transition-transform"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
