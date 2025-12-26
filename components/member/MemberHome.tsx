
import React, { useState, useEffect } from 'react';
import { ScanLine, Upload, Gift, ChevronRight, ExternalLink, Wallet, Banknote } from 'lucide-react';
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
    <div className="space-y-4 animate-fade-in">
        
        {/* Wallet Card - Industrial Style */}
        <div className="bg-gray-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden border-t-4 border-orange-600">
            <div className="relative z-10 flex justify-between items-end">
                <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.yourBalance}</p>
                    <h2 className="text-5xl font-black tracking-tight flex items-start">
                        <span className="text-2xl mt-1 mr-1 text-orange-500">₹</span>
                        {currentPoints}
                    </h2>
                    <p className="text-xs text-gray-400 mt-2 font-medium">1 Point = ₹1 Rupee</p>
                </div>
                <button 
                   onClick={() => onNavigate('payout')}
                   className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center"
                >
                    <Banknote className="w-4 h-4 mr-2" />
                    {t.navPayout}
                </button>
            </div>
        </div>

        {/* Promo Banner */}
        {activePromo && (
            activePromo.link ? (
                <a 
                    href={activePromo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all group relative"
                >
                    <div className="relative">
                        <img src={activePromo.imageUrl} alt="Offer" className="w-full h-32 object-cover" />
                        <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full backdrop-blur-sm text-white">
                           <ExternalLink className="w-3 h-3" />
                        </div>
                    </div>
                </a>
            ) : (
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    <img src={activePromo.imageUrl} alt="Offer" className="w-full h-32 object-cover" />
                </div>
            )
        )}

        {/* Action Grid - High Contrast */}
        <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={() => onNavigate('scan')}
                className="bg-white p-5 rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.1)] border-2 border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-orange-500 hover:text-orange-600 active:scale-95 transition-all group"
             >
                 <div className="w-12 h-12 bg-gray-100 group-hover:bg-orange-50 text-gray-700 group-hover:text-orange-600 rounded-full flex items-center justify-center transition-colors">
                    <ScanLine className="w-6 h-6" />
                 </div>
                 <span className="font-black text-gray-900 text-sm uppercase tracking-wide">{t.navScan}</span>
             </button>

             <button 
                onClick={() => onNavigate('upload')}
                className="bg-white p-5 rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.1)] border-2 border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-600 active:scale-95 transition-all group"
             >
                 <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-50 text-gray-700 group-hover:text-blue-600 rounded-full flex items-center justify-center transition-colors">
                    <Upload className="w-6 h-6" />
                 </div>
                 <span className="font-black text-gray-900 text-sm uppercase tracking-wide">{t.haveBill}</span>
             </button>
        </div>

        {/* Quick History Link */}
        <button 
            onClick={() => onNavigate('history')}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                    <Gift className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm uppercase">{t.transactionHistory}</p>
                    <p className="text-xs text-gray-500 font-bold">Check Status</p>
                </div>
            </div>
            <div className="bg-gray-100 p-2 rounded-full">
               <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
        </button>

    </div>
  );
};
