
import React, { useState, useEffect, memo } from 'react';
import { QrCode, Plus, Gift, Printer, FileSpreadsheet, Loader2, Tag } from 'lucide-react';
import { LoyaltyBatch, GiftCard, User } from '../../types';
import { GiftCardService } from '../../services/backend';
import { useNotification } from '../../contexts/NotificationContext';
import { PrintableStickerSheet } from './PrintableStickerSheet';
import { StickerPreviewModal } from './StickerPreviewModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { TableRowSkeleton } from '../common/Skeleton';

interface CouponGeneratorProps {
  user?: User;
}

const QUICK_POINTS = ['50', '100', '200', '500'];
const QUICK_QTY = ['10', '20', '50', '100'];

export const CouponGenerator: React.FC<CouponGeneratorProps> = memo(({ user }) => {
  const { addNotification } = useNotification();
  const { t } = useLanguage();
  const [batches, setBatches] = useState<LoyaltyBatch[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchPoints, setBatchPoints] = useState<string>('100');
  const [batchQty, setBatchQty] = useState<string>('50');
  const [batchName, setBatchName] = useState('');
  
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [targetBatch, setTargetBatch] = useState<LoyaltyBatch | null>(null);
  const [printDensity, setPrintDensity] = useState<number>(30);
  const [activePrintBatch, setActivePrintBatch] = useState<LoyaltyBatch | null>(null);

  useEffect(() => {
    fetchBatches();
  }, [user]);

  const fetchBatches = async () => {
      setLoading(true);
      try {
          const data = await GiftCardService.getAllBatches();
          if (user?.role === 'STORE_ADMIN') {
            setBatches(data.filter(b => b.storeId === user.name));
          } else {
            setBatches(data);
          }
      } catch (error) {
          addNotification('Error', 'Failed to load coupons', 'error');
      } finally {
          setLoading(false);
      }
  };

  const generateBatch = async () => {
    if (!batchPoints || !batchQty) return;
    setIsGenerating(true);
    const qty = parseInt(batchQty);
    const points = parseInt(batchPoints);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    
    const newCodes: GiftCard[] = Array.from({ length: qty }, (_, i) => {
        const randStr = (len: number) => Array.from({length: len}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        return {
            id: `V${Date.now()}-${i}`,
            code: `${randStr(4)}-${randStr(4)}`,
            type: 'POINT_VOUCHER',
            value: points,
            status: 'Active',
            createdDate: new Date().toISOString().split('T')[0],
            expiryDate: '2025-12-31'
        };
    });

    const newBatch: LoyaltyBatch = {
      id: `B-${Date.now().toString().slice(-6)}`,
      name: batchName || `Batch ${new Date().toLocaleDateString()}`,
      pointsPerCode: points,
      quantity: qty,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      codes: newCodes,
      storeId: user?.role === 'STORE_ADMIN' ? user.name : undefined
    };

    try {
        const createdBatch = await GiftCardService.createBatch(newBatch);
        setBatches(prev => [createdBatch, ...prev]);
        setIsGenerateOpen(false);
        setBatchName('');
        addNotification('Success', `Generated ${qty} coupons`, 'success');
    } catch (error) {
        addNotification('Error', 'Failed to generate', 'error');
    } finally {
        setIsGenerating(false);
    }
  };

  const handleOpenPreview = (batch: LoyaltyBatch) => {
      setTargetBatch(batch);
      setPreviewModalOpen(true);
  };

  const handleConfirmPrint = (density: number) => {
    if (targetBatch) {
      setPrintDensity(density);
      setActivePrintBatch(targetBatch);
      setPreviewModalOpen(false);
      setTimeout(() => window.print(), 300);
    }
  };

  return (
       <div className="space-y-6 animate-fade-in pb-24 md:pb-0">
          <PrintableStickerSheet batch={activePrintBatch} density={printDensity} />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div><h2 className="text-xl font-bold flex items-center text-gray-900"><QrCode className="w-6 h-6 mr-2 text-orange-600" />{t.qrGenerator}</h2></div>
             <button onClick={() => setIsGenerateOpen(true)} className="hidden md:flex px-5 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-all items-center shadow-lg active:scale-95"><Plus className="w-4 h-4 mr-2" />{t.generateNew}</button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {loading ? (
                <div className="divide-y divide-gray-100">
                   {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
                </div>
             ) : (
                 <div className="overflow-x-auto">
                    {batches.length === 0 ? <div className="p-16 text-center text-gray-400"><Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>{t.noBatches}</p></div> : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs uppercase font-bold tracking-wider">
                        <tr><th className="px-6 py-4">{t.batchName}</th><th className="px-6 py-4">{t.details}</th><th className="px-6 py-4">{t.status}</th><th className="px-6 py-4 text-right">{t.action}</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {batches.map(batch => (
                            <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4"><div className="font-bold text-sm text-gray-900">{batch.name}</div><div className="text-xs text-gray-400 font-mono mt-0.5">{batch.id}</div></td>
                            <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200"><Tag className="w-3 h-3 mr-1.5 text-gray-400" />{batch.quantity} x {batch.pointsPerCode} pts</span></td>
                            <td className="px-6 py-4"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${batch.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{batch.status}</span></td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleOpenPreview(batch)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Printer className="w-4 h-4" /></button>
                                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"><FileSpreadsheet className="w-4 h-4" /></button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    )}
                 </div>
             )}
          </div>
          
          {/* Mobile FAB */}
          <button onClick={() => setIsGenerateOpen(true)} className="md:hidden fixed bottom-24 right-5 h-14 w-14 bg-orange-600 text-white rounded-full shadow-lg shadow-orange-600/40 flex items-center justify-center z-40"><Plus className="w-7 h-7" /></button>

          {/* Generator Sheet */}
          {isGenerateOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-fade-in">
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                 <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                     <h3 className="text-lg font-bold text-gray-900">{t.generateNew}</h3>
                     <button onClick={() => setIsGenerateOpen(false)} className="text-gray-400"><Plus className="w-6 h-6 rotate-45" /></button>
                 </div>
                 <div className="p-6 space-y-4">
                    <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t.pointsPerCoupon}</label>
                         <div className="grid grid-cols-4 gap-2">
                            {QUICK_POINTS.map(p => <button key={p} onClick={() => setBatchPoints(p)} className={`py-2 rounded-lg text-sm font-bold border ${batchPoints === p ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-200'}`}>{p}</button>)}
                         </div>
                    </div>
                    <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t.quantity}</label>
                         <div className="grid grid-cols-4 gap-2">
                            {QUICK_QTY.map(q => <button key={q} onClick={() => setBatchQty(q)} className={`py-2 rounded-lg text-sm font-bold border ${batchQty === q ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200'}`}>{q}</button>)}
                         </div>
                    </div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Name</label><input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-bold" /></div>
                 </div>
                 <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button onClick={generateBatch} disabled={isGenerating} className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold">{isGenerating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Generate'}</button>
                 </div>
              </div>
            </div>
          )}

          {targetBatch && (
            <StickerPreviewModal 
              batch={targetBatch}
              isOpen={previewModalOpen}
              onClose={() => setPreviewModalOpen(false)}
              onPrint={handleConfirmPrint}
            />
          )}
       </div>
  );
});
