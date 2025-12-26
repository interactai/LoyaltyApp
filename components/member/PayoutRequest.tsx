
import React, { useState } from 'react';
import { IndianRupee, ArrowRight, Loader2, X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MemberService } from '../../services/backend';
import { useNotification } from '../../contexts/NotificationContext';

interface PayoutRequestProps {
    currentPoints: number;
    userId: string;
    onSuccess: (amount: number) => void;
    onCancel: () => void;
}

export const PayoutRequest: React.FC<PayoutRequestProps> = ({ currentPoints, userId, onSuccess, onCancel }) => {
    const { t } = useLanguage();
    const { addNotification } = useNotification();
    const [amount, setAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayout = async (e: React.FormEvent) => {
        e.preventDefault();
        const withdrawAmount = parseInt(amount);

        if (!withdrawAmount || withdrawAmount <= 0) {
            addNotification('Error', 'Enter valid amount', 'error');
            return;
        }
        if (withdrawAmount > currentPoints) {
            addNotification('Error', 'Insufficient Balance', 'error');
            return;
        }
        if (!upiId.includes('@')) {
             addNotification('Error', 'Invalid UPI ID', 'error');
             return;
        }

        setLoading(true);
        try {
            await MemberService.requestPayout(userId, withdrawAmount, upiId);
            addNotification('Success', 'Withdrawal Request Sent!', 'success');
            onSuccess(withdrawAmount);
        } catch (err: any) {
            addNotification('Error', err.message || 'Failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-gray-900 uppercase">{t.requestPayout}</h2>
                <button onClick={onCancel} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6 flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-orange-800 font-bold uppercase">{t.availableBalance}</p>
                    <p className="text-2xl font-black text-orange-600">₹{currentPoints}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-orange-200" />
            </div>

            <form onSubmit={handlePayout} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.enterAmount}</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 font-bold text-lg outline-none focus:border-orange-500"
                        placeholder="0"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.enterUpi}</label>
                    <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 font-bold text-lg outline-none focus:border-orange-500"
                        placeholder="mobile@upi"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 font-medium flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1 text-orange-500" />
                        {t.payoutNote}
                    </p>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 hover:bg-black"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            {t.sendRequest} <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
