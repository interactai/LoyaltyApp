
import React, { useState, useEffect } from 'react';
import { Banknote, Check, X, Clock, Search, ExternalLink, Loader2 } from 'lucide-react';
import { PayoutRequest } from '../types';
import { MemberService } from '../services/backend';
import { useNotification } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

export const PayoutManagementView: React.FC = () => {
  const { t } = useLanguage();
  const { addNotification } = useNotification();
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('Pending');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    // In a real app, we'd have a PayoutService. For now, simulate with mock data in storage
    const mockRequests = JSON.parse(localStorage.getItem('vista_payouts') || '[]');
    setRequests(mockRequests);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: 'Completed' | 'Rejected') => {
    const updated = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setRequests(updated);
    localStorage.setItem('vista_payouts', JSON.stringify(updated));
    addNotification('Status Updated', `Payout marked as ${newStatus}`, 'success');
  };

  const filtered = requests.filter(r => filter === 'All' || r.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-green-600" />
            Payout Requests
          </h2>
          <p className="text-sm text-gray-500">Review and approve partner cash withdrawals via UPI.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
           {(['Pending', 'Completed', 'All'] as const).map(tab => (
             <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
             <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p>No {filter.toLowerCase()} requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Partner</th>
                  <th className="px-6 py-4">UPI ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-sm">{req.userName}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">{req.userId}</p>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{req.upiId}</code>
                          <button onClick={() => navigator.clipboard.writeText(req.upiId)} className="text-blue-500 hover:text-blue-700"><ExternalLink className="w-3 h-3" /></button>
                       </div>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">₹{req.amount}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        req.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                        req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'Completed')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                            title="Mark Completed"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
