import React from 'react';
import { Download, X, AppWindow } from 'lucide-react';
import { usePWA } from '../contexts/PWAContext';

export const PWAInstallPrompt: React.FC = () => {
  const { showPrompt, installApp, dismissPrompt } = usePWA();

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-4 right-4 z-[200] animate-slide-up max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-600"></div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <AppWindow className="w-8 h-8 text-orange-600 dark:text-orange-500" />
          </div>
          
          <div className="flex-1 pr-6">
            <h3 className="text-gray-900 dark:text-white font-bold text-base tracking-tight">
              Get the App
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1 leading-relaxed">
              Install for a faster experience and instant notifications.
            </p>
            
            <div className="flex gap-3 mt-5">
              <button 
                onClick={installApp}
                className="bg-gray-900 dark:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install
              </button>
              <button 
                onClick={dismissPrompt}
                className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Later
              </button>
            </div>
          </div>

          <button 
            onClick={dismissPrompt}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};