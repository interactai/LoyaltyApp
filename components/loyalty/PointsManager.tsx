
import React, { useState, useEffect, memo } from 'react';
import { Users, Award, Search, StickyNote, Plus, Minus, Phone, Loader2 } from 'lucide-react';
import { Customer } from '../../types';
import { MemberService } from '../../services/backend';
import { useNotification } from '../../contexts/NotificationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { TableRowSkeleton } from '../common/Skeleton';

export const PointsManager: React.FC = memo(() => {
  const { addNotification } = useNotification();
  const { t } = useLanguage();
  const [members, setMembers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Action Modal State
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [pointsAmount, setPointsAmount] = useState<string>('');
  const [actionNote, setActionNote] = useState<string>('');
  const [actionType, setActionType] = useState<'add' | 'redeem'>('add');

  const cardClass = "bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800";
  const tableHeaderClass = "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-xs uppercase font-bold";
  const tableRowClass = "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800";

  const refreshMembers = async () => {
      setLoading(true);
      try {
          const data = await MemberService.getAllMembers();
          setMembers(data);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    refreshMembers();
  }, []);

  const handlePointsAction = async () => {
    if (!selectedMemberId || !pointsAmount) return;
    const amount = parseInt(pointsAmount);
    
    try {
        await MemberService.updateMemberPoints(selectedMemberId, amount, actionType, actionNote);
        await refreshMembers();
        setIsActionModalOpen(false);
        setPointsAmount('');
        setActionNote('');
        setSelectedMemberId(null);
        addNotification('Success', `Points ${actionType === 'add' ? 'added' : 'redeemed'} successfully`, 'success');
    } catch (e) {
        addNotification('Error', 'Failed to update points', 'error');
    }
  };

  const openActionModal = (memberId: string, type: 'add' | 'redeem') => {
      setSelectedMemberId(memberId);
      setActionType(type);
      setPointsAmount('');
      setActionNote('');
      setIsActionModalOpen(true);
  };

  const renderTierBadge = (tier: Customer['tier']) => {
    const colors: Record<string, string> = {
      'Bronze': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800/50',
      'Silver': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
      'Gold': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50',
      'Platinum': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[tier] || colors['Bronze']}`}>
        {tier}
      </span>
    );
  };

  const filteredMembers = members.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className={`${cardClass} p-5 flex items-center`}>
             <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-950/20 text-orange-600 dark:text-orange-500 mr-4"><Users className="w-6 h-6" /></div>
             <div><p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase">{t.totalMembers}</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : members.length}</p></div>
          </div>
          <div className={`${cardClass} p-5 flex items-center`}>
             <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-500 mr-4"><Award className="w-6 h-6" /></div>
             <div><p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase">{t.pointsIssued}</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : members.reduce((acc, p) => acc + p.lifetimePoints, 0).toLocaleString()}</p></div>
          </div>
        </div>

        <div className={`${cardClass} p-4 flex flex-col sm:flex-row justify-between items-center gap-4`}>
           <div className="relative w-full sm:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder={t.search} 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className={`w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm outline-none dark:text-white`}
             />
           </div>
        </div>

        <div className={`${cardClass} overflow-hidden`}>
           <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left">
                 <thead className={tableHeaderClass}>
                   <tr>
                     <th className="px-6 py-3">{t.member}</th>
                     <th className="px-6 py-3">{t.phone}</th>
                     <th className="px-6 py-3 text-right">{t.pointsBalance}</th>
                     <th className="px-6 py-3 text-right">{t.action}</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {loading ? (
                     [...Array(5)].map((_, i) => (
                       <tr key={i}><td colSpan={4}><TableRowSkeleton /></td></tr>
                     ))
                   ) : filteredMembers.map(member => (
                     <tr key={member.id} className={tableRowClass}>
                       <td className="px-6 py-3">
                         <p className={`font-bold text-gray-900 dark:text-white text-sm`}>{member.name}</p>
                         <p className={`text-xs text-gray-500 mt-0.5`}>{renderTierBadge(member.tier)}</p>
                       </td>
                       <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400 font-mono">{member.phone}</td>
                       <td className="px-6 py-3 text-right font-bold text-orange-600 dark:text-orange-500 text-lg">{member.pointsBalance.toLocaleString()}</td>
                       <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openActionModal(member.id, 'add')}
                              className="px-3 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-500 rounded border border-green-200 dark:border-green-900/30 text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 flex items-center transition-colors"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              {t.add}
                            </button>
                            <button 
                              onClick={() => openActionModal(member.id, 'redeem')}
                              className="px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-500 rounded border border-red-200 dark:border-red-900/30 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center transition-colors"
                            >
                              <Minus className="w-3 h-3 mr-1" />
                              {t.debit}
                            </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
           </div>

           {/* Mobile Card View */}
           <div className="md:hidden">
               <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
                  ) : filteredMembers.map(member => (
                      <div key={member.id} className="p-4 bg-white dark:bg-gray-900 space-y-3">
                          <div className="flex justify-between items-start">
                              <div>
                                  <p className="font-bold text-gray-900 dark:text-white text-sm">{member.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {renderTierBadge(member.tier)}
                                    <span className="text-xs text-gray-400 flex items-center font-mono"><Phone className="w-3 h-3 mr-1"/>{member.phone}</span>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-lg font-bold text-orange-600 dark:text-orange-500">{member.pointsBalance.toLocaleString()}</p>
                                  <p className="text-[10px] text-gray-400 uppercase font-bold">Points</p>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 pt-2">
                                <button 
                                  onClick={() => openActionModal(member.id, 'add')}
                                  className="py-2 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-500 rounded-lg border border-green-200 dark:border-green-900/30 text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  {t.add} Points
                                </button>
                                <button 
                                  onClick={() => openActionModal(member.id, 'redeem')}
                                  className="py-2 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-500 rounded-lg border border-red-200 dark:border-red-900/30 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-colors"
                                >
                                  <Minus className="w-4 h-4 mr-1" />
                                  Redeem
                                </button>
                          </div>
                      </div>
                  ))}
               </div>
               {!loading && filteredMembers.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">No members found.</div>
               )}
           </div>
        </div>

        {isActionModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm shadow-xl border border-gray-100 dark:border-gray-800">
               <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                 {actionType === 'add' ? t.addPoints : t.redeemed}
               </h3>
               
               <div className="space-y-4 mb-6">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.amount}</label>
                     <input 
                       type="number" 
                       value={pointsAmount}
                       onChange={(e) => setPointsAmount(e.target.value)}
                       autoFocus
                       className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xl font-bold outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                       placeholder="0"
                     />
                   </div>

                   {actionType === 'redeem' && (
                       <div>
                         <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center">
                            <StickyNote className="w-3 h-3 mr-1" />
                            {t.redemptionNote}
                         </label>
                         <textarea 
                           value={actionNote}
                           onChange={(e) => setActionNote(e.target.value)}
                           className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors`}
                           placeholder="e.g. Gifted Bosch Drill Machine"
                           rows={2}
                         />
                       </div>
                   )}
               </div>

               <div className="flex gap-3">
                  <button onClick={() => setIsActionModalOpen(false)} className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors">{t.cancel}</button>
                  <button onClick={handlePointsAction} disabled={!pointsAmount} className={`flex-1 py-3 rounded-lg text-white font-bold text-sm shadow-sm transition-all active:scale-95 ${actionType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>{t.confirm}</button>
               </div>
            </div>
          </div>
        )}
      </div>
  );
});
