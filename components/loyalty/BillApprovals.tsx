
import React, { useState, useEffect } from 'react';
import { FileText, Check, X, Calendar, User as UserIcon } from 'lucide-react';
import { InvoiceRequest, User } from '../../types';
import { InvoiceService, MemberService } from '../../services/backend';
import { useNotification } from '../../contexts/NotificationContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface BillApprovalsProps {
  user?: User;
}

export const BillApprovals: React.FC<BillApprovalsProps> = ({ user }) => {
  const { addNotification } = useNotification();
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<InvoiceRequest[]>([]);
  
  const cardClass = "bg-white rounded-xl shadow-sm border border-gray-200";
  const tableHeaderClass = "bg-gray-100 text-gray-600 border-b border-gray-200 text-xs uppercase font-bold";
  const tableRowClass = "hover:bg-gray-50 transition-colors border-b border-gray-100";
  const textMain = "text-gray-900 text-sm font-semibold";
  const textSub = "text-gray-500 text-xs";

  useEffect(() => {
    const fetchInvoices = async () => {
        const storeName = user?.role === 'STORE_ADMIN' ? user.name : undefined;
        try {
            const data = await InvoiceService.getAllInvoices(storeName);
            setInvoices(data);
        } catch (e) {
            console.error(e);
        }
    };
    fetchInvoices();
  }, [user]);

  const handleInvoiceAmountChange = async (id: string, newVal: string) => {
    const numVal = parseFloat(newVal);
    const amount = isNaN(numVal) ? 0 : numVal;
    
    // Update locally immediately for UI
    setInvoices(invoices.map(i => i.id === id ? { ...i, amount } : i));
    
    // Update backend
    await InvoiceService.updateInvoiceAmount(id, amount);
  };

  const handleApproveInvoice = async (invoiceId: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    try {
        await MemberService.updateMemberPoints(
            inv.customerId, 
            Math.floor(inv.amount), 
            'add', 
            `Bill Approved: #${inv.invoiceNumber}`,
            inv.storeName // Pass store name to attribute points
        );
        const updatedInv = await InvoiceService.updateInvoiceStatus(invoiceId, 'Approved');
        setInvoices(invoices.map(i => i.id === invoiceId ? updatedInv : i));
        addNotification('Bill Approved', `${Math.floor(inv.amount)} points credited.`, 'success');
    } catch (e) {
        addNotification('Error', 'Failed to approve bill.', 'error');
    }
  };

  const handleRejectInvoice = async (id: string) => {
    try {
        const updatedInv = await InvoiceService.updateInvoiceStatus(id, 'Rejected');
        setInvoices(invoices.map(i => i.id === id ? updatedInv : i));
        addNotification('Bill Rejected', 'Status updated to Rejected.', 'info');
    } catch (e) {
        addNotification('Error', 'Failed to reject bill', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
     if(status === 'Approved') return <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">{t.approved}</span>;
     if(status === 'Rejected') return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">{t.rejected}</span>;
     return <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200">{t.pending}</span>;
  };

  return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
              <h2 className="text-xl font-bold mb-1 flex items-center text-gray-900">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                {t.billUploads}
              </h2>
              <p className="text-gray-500 text-sm">
                 {t.approveBillsDesc}
              </p>
           </div>
           <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-bold text-sm whitespace-nowrap">
              {t.pending}: {invoices.filter(i => i.status === 'Pending').length}
           </div>
        </div>

        <div className={`${cardClass} overflow-hidden`}>
           {/* Desktop Table View */}
           <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left">
                 <thead className={tableHeaderClass}>
                   <tr>
                     <th className="px-6 py-3">{t.billDetails}</th>
                     <th className="px-6 py-3">{t.partnerName}</th>
                     <th className="px-6 py-3">{t.amount} (₹)</th>
                     <th className="px-6 py-3">{t.reward}</th>
                     <th className="px-6 py-3">{t.status}</th>
                     <th className="px-6 py-3 text-right">{t.action}</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                          No pending bills.
                        </td>
                      </tr>
                   ) : (
                      invoices.map(inv => (
                        <tr key={inv.id} className={tableRowClass}>
                          <td className="px-6 py-3">
                            <div>
                              <p className={`font-bold ${textMain}`}>#{inv.invoiceNumber}</p>
                              <p className={`text-[10px] ${textSub}`}>{inv.date}</p>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                              <p className={`font-semibold ${textMain}`}>{inv.customerName}</p>
                              <p className={`text-[10px] ${textSub}`}>ID: {inv.customerId}</p>
                          </td>
                          <td className="px-6 py-3">
                              {inv.status === 'Pending' ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-400 font-bold text-sm">₹</span>
                                  <input 
                                    type="number"
                                    value={inv.amount}
                                    onChange={(e) => handleInvoiceAmountChange(inv.id, e.target.value)}
                                    className="w-24 px-2 py-1 rounded border border-gray-300 font-bold text-sm"
                                  />
                                </div>
                              ) : (
                                <span className={`font-bold ${textMain}`}>₹{inv.amount.toLocaleString()}</span>
                              )}
                          </td>
                          <td className="px-6 py-3">
                              <span className="font-bold text-orange-600 text-sm">
                                {Math.floor(inv.amount * 1)} pts
                              </span>
                          </td>
                          <td className="px-6 py-3">
                            {getStatusBadge(inv.status)}
                          </td>
                          <td className="px-6 py-3 text-right">
                            {inv.status === 'Pending' ? (
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => handleApproveInvoice(inv.id)}
                                    className="p-1.5 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleRejectInvoice(inv.id)}
                                    className="p-1.5 bg-red-50 text-red-700 rounded border border-red-200 hover:bg-red-100"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                   )}
                 </tbody>
               </table>
           </div>

           {/* Mobile Card View */}
           <div className="md:hidden">
              <div className="divide-y divide-gray-100">
                  {invoices.map(inv => (
                      <div key={inv.id} className="p-4 bg-white space-y-3">
                          <div className="flex justify-between items-start">
                              <div>
                                  <p className="font-bold text-gray-900 text-sm">#{inv.invoiceNumber}</p>
                                  <p className="text-xs text-gray-500 flex items-center mt-1">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {inv.date}
                                  </p>
                              </div>
                              {getStatusBadge(inv.status)}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-700 font-medium">
                              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {inv.customerName}
                          </div>

                          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                               <div className="flex flex-col">
                                   <span className="text-[10px] text-gray-400 font-bold uppercase">Amount</span>
                                   {inv.status === 'Pending' ? (
                                        <div className="flex items-center gap-0.5">
                                            <span className="text-gray-500 text-sm font-bold">₹</span>
                                            <input 
                                                type="number"
                                                value={inv.amount}
                                                onChange={(e) => handleInvoiceAmountChange(inv.id, e.target.value)}
                                                className="w-20 px-1 py-0 bg-white rounded border border-gray-300 font-bold text-sm"
                                            />
                                        </div>
                                   ) : (
                                       <span className="font-bold text-gray-900">₹{inv.amount.toLocaleString()}</span>
                                   )}
                               </div>
                               <div className="flex flex-col text-right">
                                   <span className="text-[10px] text-gray-400 font-bold uppercase">Reward</span>
                                   <span className="font-bold text-orange-600">{Math.floor(inv.amount)} pts</span>
                               </div>
                          </div>

                          {inv.status === 'Pending' && (
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                  <button 
                                    onClick={() => handleApproveInvoice(inv.id)}
                                    className="flex items-center justify-center py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 border border-green-200"
                                  >
                                    <Check className="w-4 h-4 mr-1.5" /> Approve
                                  </button>
                                  <button 
                                    onClick={() => handleRejectInvoice(inv.id)}
                                    className="flex items-center justify-center py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-200"
                                  >
                                    <X className="w-4 h-4 mr-1.5" /> Reject
                                  </button>
                              </div>
                          )}
                      </div>
                  ))}
                  {invoices.length === 0 && (
                      <div className="p-8 text-center text-gray-400 text-sm">No pending bills.</div>
                  )}
              </div>
           </div>
        </div>
      </div>
  );
};
