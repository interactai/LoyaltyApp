import React, { useState, useEffect } from 'react';
import { ScanLine, Upload, Gift, ChevronRight, ExternalLink, Banknote, Wallet } from 'lucide-react';
import { User, PromoBanner } from '../../types';
import { MarketingService } from '../../services/backend';
import { useLanguage } from '../../contexts/LanguageContext';

interface MemberHomeProps {
  user: User;
  currentPoints: number;
  onNavigate: (tab: 'upload' | 'scan' | 'history' | 'payout') => void;
}

export const MemberHome: React.FC<MemberHomeProps> = ({ user, currentPoints, onNavigate }) => {
  const { t } = useLanguage();
  const [activePromo, setActivePromo] = useState<PromoBanner | null>(null);

  useEffect(() => {
    const fetchPromo = async () => {
        try {
            const promos = await MarketingService.getActiveBanners();
            if (promos.length > 0) setActivePromo(promos[0]);
        } catch (e) {
            console.error("Failed to load promo");
        }
    };
    fetchPromo();
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
        
        {/* Soft Modern Wallet Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">{t.yourBalance}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-orange-600">₹</span>
                        <h2 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                            {currentPoints}
                        </h2>
                    </div>
                </div>
                <button 
                   onClick={() => onNavigate('payout')}
                   className="w-full sm:w-auto bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-orange-100 hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Banknote className="w-5 h-5" />
                    {t.navPayout}
                </button>
            </div>
        </div>

        {/* Promo Banner - Rounded */}
        {activePromo && (
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <img src={activePromo.imageUrl} alt="Offer" className="w-full h-40 object-cover" />
                {activePromo.link && (
                    <a href={activePromo.link} target="_blank" rel="noopener" className="p-4 flex items-center justify-between bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">
                        Check Offer Details <ExternalLink className="w-4 h-4 text-orange-600" />
                    </a>
                )}
            </div>
        )}

        {/* Intuitive Large Buttons */}
        <div className="grid grid-cols-1 gap-4">
             <button 
                onClick={() => onNavigate('scan')}
                className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center gap-6 active:scale-95 transition-all group"
             >
                 <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <ScanLine className="w-8 h-8" strokeWidth={2.5} />
                 </div>
                 <span className="font-bold text-xl text-gray-900 dark:text-white uppercase tracking-tight">{t.navScan}</span>
             </button>

             <button 
                onClick={() => onNavigate('upload')}
                className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center gap-6 active:scale-95 transition-all group"
             >
                 <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" strokeWidth={2.5} />
                 </div>
                 <span className="font-bold text-xl text-gray-900 dark:text-white uppercase tracking-tight">Upload Bill</span>
             </button>
        </div>

        {/* History Link - Rounded */}
        <button 
            onClick={() => onNavigate('history')}
            className="w-full bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm active:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    <Wallet className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-sm uppercase">{t.transactionHistory}</p>
                    <p className="text-xs text-gray-400 font-medium">View detailed logs</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>

    </div>
  );
};