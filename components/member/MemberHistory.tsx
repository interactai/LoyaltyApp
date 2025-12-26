
import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Store } from 'lucide-react';
import { User, Transaction } from '../../types';
import { MemberService } from '../../services/backend';
import { useLanguage } from '../../contexts/LanguageContext';

interface MemberHistoryProps {
  user?: User;
}

export const MemberHistory: React.FC<MemberHistoryProps> = ({ user }) => {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [storeBalances, setStoreBalances] = useState<{name: string, points: number}[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchHistory = async () => {
        if (!user?.id) return;
        try {
            // Fetch fresh data to ensure balances are up to date
            const member = await MemberService.getMemberByPhone(user.id);
            
            if (member) {
                if (member.history) setHistory(member.history);
                if (member.storeBalances) {
                    setStoreBalances(Object.entries(member.storeBalances).map(([name, points]) => ({ name, points })));
                }
            } else if (user.history) {
                // Fallback to prop data
                setHistory(user.history);
                if (user.storeBalances) {
                    setStoreBalances(Object.entries(user.storeBalances).map(([name, points]) => ({ name, points })));
                }
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        
        {/* Store Balances Section */}
        {storeBalances.length > 0 && (
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">My Distributors</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {storeBalances.map((store, idx) => (
                        <div key={idx} className="flex-none w-40 bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                                    <Store className="w-3 h-3" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 truncate">{store.name}</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">₹{store.points}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t.transactionHistory}</h2>
        </div>

        <div className="divide-y divide-gray-100">
            {history.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                    {t.noHistory}
                </div>
            ) : (
                history.map((item) => (
                    <div key={item.id} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${item.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {item.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">
                                {item.type === 'CREDIT' ? t.pointsAdded : t.redeemed}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">{item.note || item.date}</p>
                        </div>
                        <div className="text-right">
                            <span className={`block font-bold text-sm ${item.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                {item.type === 'CREDIT' ? '+' : '-'}{item.amount}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};
