
import React, { useState } from 'react';
import { LayoutDashboard, Upload, History, LogOut, ScanLine, Wallet } from 'lucide-react';
import { User } from '../types';
import { MemberHome } from './member/MemberHome';
import { MemberBillUpload } from './member/MemberBillUpload';
import { MemberHistory } from './member/MemberHistory';
import { QRScanner } from './member/QRScanner';
import { PayoutRequest } from './member/PayoutRequest';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { GiftCardService } from '../services/backend';
import { NotificationToast } from './NotificationToast';

interface MemberDashboardProps {
  user: User;
  onSignOut: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'upload' | 'history' | 'payout'>('home');
  const [currentPoints, setCurrentPoints] = useState(user.points || 0);
  const { t } = useLanguage();
  const { addNotification } = useNotification();

  const handleQRScan = async (code: string) => {
    if (!code) return;
    try {
        const result = await GiftCardService.redeemCode(code, undefined, user.mobile || user.id);
        if (result.success) {
            setCurrentPoints(prev => prev + result.value);
            // @ts-ignore
            addNotification('Success', t.scanSuccess || `+${result.value} Added to Wallet!`, 'success');
            setActiveTab('home');
        } else {
            // Map Backend Errors to Hindi if possible
            let msg = result.message;
            // @ts-ignore
            if (msg.includes('Invalid code') || msg.includes('not found')) msg = t.scanInvalid || 'Invalid Code';
            // @ts-ignore
            else if (msg.includes('Redeemed') || msg.includes('Expired')) msg = t.scanUsed || 'Code already used';
            
            addNotification('Error', msg, 'error');
        }
    } catch (e) {
        // @ts-ignore
        addNotification('Error', t.scanError || 'Failed to redeem coupon', 'error');
    }
  };

  const handlePayoutSuccess = (amount: number) => {
      setCurrentPoints(prev => prev - amount);
      setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans pb-24 transition-colors duration-200">
        <NotificationToast />

        {/* Top Navigation Bar - Industrial Style */}
        <nav className="bg-gray-900 dark:bg-black border-b border-gray-800 dark:border-gray-900 sticky top-0 z-30 px-4 py-3 shadow-md">
            <div className="max-w-md mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-600 rounded flex items-center justify-center text-white font-black text-sm border-2 border-orange-500 shadow-lg">
                        {user.initials}
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white leading-none mb-0.5">{user.name}</h1>
                        <p className="text-xs text-orange-400 dark:text-orange-500 font-bold tracking-wide">₹{currentPoints} Balance</p>
                    </div>
                </div>
                <button onClick={onSignOut} className="text-gray-400 hover:text-white p-2">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </nav>

        <main className="max-w-md mx-auto p-4">
            {activeTab === 'home' && (
                <MemberHome 
                   user={user} 
                   currentPoints={currentPoints} 
                   onNavigate={(tab) => setActiveTab(tab as any)}
                />
            )}

            {activeTab === 'scan' && (
                <QRScanner onScan={handleQRScan} onClose={() => setActiveTab('home')} />
            )}

            {activeTab === 'upload' && (
                <MemberBillUpload onSuccess={() => setActiveTab('home')} onCancel={() => setActiveTab('home')} />
            )}
            
            {activeTab === 'payout' && (
                <PayoutRequest 
                    currentPoints={currentPoints} 
                    userId={user.id} 
                    onSuccess={handlePayoutSuccess} 
                    onCancel={() => setActiveTab('home')}
                />
            )}

            {activeTab === 'history' && (
                <MemberHistory user={user} />
            )}
        </main>
        
        {/* Industrial Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 max-w-md mx-auto right-0 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-end px-4 h-[70px] relative">
                
                {/* Left: Home */}
                <button 
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center justify-center h-full w-16 transition-colors ${activeTab === 'home' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
                >
                    <LayoutDashboard className="w-6 h-6 mb-1" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase">{t.dashboard}</span>
                </button>
                
                {/* Left Center: Payout */}
                <button 
                    onClick={() => setActiveTab('payout')}
                    className={`flex flex-col items-center justify-center h-full w-16 transition-colors ${activeTab === 'payout' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
                >
                    <Wallet className="w-6 h-6 mb-1" strokeWidth={activeTab === 'payout' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase">Cash</span>
                </button>

                {/* Center: SCAN - MASSIVE INDUSTRIAL BUTTON */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[-30px] flex flex-col items-center justify-center z-50">
                    <button 
                        onClick={() => setActiveTab('scan')}
                        className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-4 border-white dark:border-gray-950 shadow-2xl transition-transform active:scale-95 ${activeTab === 'scan' ? 'bg-gray-900 dark:bg-gray-700 text-white' : 'bg-orange-600 text-white'}`}
                    >
                        <ScanLine className="w-8 h-8 mb-0.5" strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest">SCAN</span>
                    </button>
                </div>

                {/* Right Center: Upload */}
                <button 
                    onClick={() => setActiveTab('upload')}
                    className={`flex flex-col items-center justify-center h-full w-16 transition-colors ${activeTab === 'upload' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
                >
                    <Upload className="w-6 h-6 mb-1" strokeWidth={activeTab === 'upload' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase">Upload</span>
                </button>

                {/* Right: History */}
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex flex-col items-center justify-center h-full w-16 transition-colors ${activeTab === 'history' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
                >
                    <History className="w-6 h-6 mb-1" strokeWidth={activeTab === 'history' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase">Logs</span>
                </button>
            </div>
        </div>
    </div>
  );
};
