
import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { AUTH_CONFIG } from '../../config';
import { useNotification } from '../../contexts/NotificationContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface MemberBillUploadProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const MemberBillUpload: React.FC<MemberBillUploadProps> = ({ onSuccess, onCancel }) => {
  const { addNotification } = useNotification();
  const { t } = useLanguage();
  const stores = AUTH_CONFIG.users.filter(u => u.role === 'STORE_ADMIN');
  
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [selectedStore, setSelectedStore] = useState(stores[0]?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setInvoiceFile(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!invoiceAmount || !invoiceNumber || !invoiceFile) {
        addNotification('Error', 'Please fill all fields', 'error');
        return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
        setIsSubmitting(false);
        addNotification('Success', `Sent to ${selectedStore}!`, 'success');
        onSuccess();
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">{t.uploadBillTitle}</h2>
            <button onClick={onCancel} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-4 h-4 text-gray-600" />
            </button>
        </div>

        <form onSubmit={handleInvoiceSubmit} className="space-y-4">
             <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.selectStore}</label>
                 <select
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-orange-500"
                 >
                    {stores.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                 </select>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.billAmount}</label>
                     <input 
                        type="number"
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-orange-500"
                     />
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.billNumber}</label>
                     <input 
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder="INV-..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-orange-500"
                     />
                 </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.photo}</label>
                <div 
                    onClick={() => document.getElementById('bill-upload')?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative overflow-hidden"
                >
                    {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <>
                            <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                            <span className="text-xs text-gray-400 font-bold">{t.tapToTake}</span>
                        </>
                    )}
                    <input 
                        id="bill-upload"
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleFileChange} 
                        capture="environment"
                    />
                </div>
             </div>

             <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
             >
                {isSubmitting ? (
                    <span className="animate-pulse">{t.uploading}</span>
                ) : (
                    <>
                        <Upload className="w-4 h-4" />
                        {t.submitBill}
                    </>
                )}
             </button>
        </form>
    </div>
  );
};
