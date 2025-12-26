
import React, { useState, useEffect, memo } from 'react';
import { Store, MapPin, Printer, FileText, Loader2, Phone, Mail, Settings, X, Shield, Ban, CheckCircle, Plus, Copy, Check, MessageCircle, Lock, RefreshCw, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { StoreService } from '../services/backend';
import { useNotification } from '../contexts/NotificationContext';

// --- SUB-COMPONENTS FOR MODULARITY & PERFORMANCE ---

const CreateStoreModal = memo(({ isOpen, onClose, onCreate }: { isOpen: boolean; onClose: () => void; onCreate: (data: any) => Promise<void> }) => {
    const [formData, setFormData] = useState({ name: '', slug: '', mobile: '', email: '' });
    const [isCreating, setIsCreating] = useState(false);
    const [resultLink, setResultLink] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', slug: '', mobile: '', email: '' });
            setResultLink('');
        }
    }, [isOpen]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData(prev => ({ ...prev, name, slug }));
    };

    const handleSubmit = async () => {
        setIsCreating(true);
        try {
            const result = await onCreate(formData);
            // @ts-ignore
            if (result && result.slug) setResultLink(`${window.location.origin}/register?store=${result.slug}`);
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(resultLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-900">Add New Store</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-5">
                    {resultLink ? (
                        <div className="animate-fade-in text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2 border-4 border-green-50">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <div><h4 className="text-2xl font-bold text-gray-900 mb-2">Success!</h4><p className="text-gray-500">Store account created.</p></div>
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between gap-3">
                                <code className="text-sm font-bold text-orange-800 truncate flex-1 text-left">{resultLink}</code>
                                <button onClick={copyToClipboard} className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-orange-600">
                                    {isCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <button onClick={onClose} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">Done</button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Store Name</label>
                                <input type="text" value={formData.name} onChange={handleNameChange} placeholder="e.g. Laxmi Hardware" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-orange-500 font-bold text-gray-900" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mobile Number</label><input type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} placeholder="98XXXXXXXX" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-orange-500 font-bold text-gray-900" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email (Optional)</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="store@gmail.com" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-orange-500 font-medium" /></div>
                            </div>
                            <div className="pt-4"><button onClick={handleSubmit} disabled={isCreating} className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-200 hover:bg-orange-700 transition-all flex items-center justify-center active:scale-95">{isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}</button></div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

const EditStoreModal = memo(({ store, isOpen, onClose, onSave }: { store: any; isOpen: boolean; onClose: () => void; onSave: (data: any) => Promise<void> }) => {
    const [form, setForm] = useState({
        name: '', mobile: '', email: '', customerQuota: 0, pointsQuota: 0, status: 'Active', canGenerateCoupons: true, canApproveBills: true
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (store && isOpen) {
            setForm({
                name: store.name,
                mobile: store.mobile,
                email: store.email,
                customerQuota: store.stats?.customerQuota || 500,
                pointsQuota: store.stats?.pointsQuota || 100000,
                status: store.accountStatus || 'Active',
                canGenerateCoupons: true,
                canApproveBills: true
            });
        }
    }, [store, isOpen]);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(form);
        setIsSaving(false);
    };

    if (!isOpen || !store) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">{store.initials}</div>
                        <div><h3 className="text-lg font-bold text-gray-900">Store Controls</h3><p className="text-xs text-gray-500">Manage permissions</p></div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>
                <div className="overflow-y-auto p-6 space-y-8">
                     <section>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center"><Store className="w-4 h-4 mr-2" /> Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Store Name</label><input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-900 outline-none focus:border-orange-500" /></div>
                            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Mobile</label><input type="text" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono text-gray-900 outline-none focus:border-orange-500" /></div>
                        </div>
                    </section>
                    <hr className="border-gray-100" />
                    <section>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center"><Shield className="w-4 h-4 mr-2" /> Quotas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Max Customers</label><input type="number" value={form.customerQuota} onChange={(e) => setForm({...form, customerQuota: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-900 outline-none focus:border-orange-500" /></div>
                            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Max Points Liability</label><input type="number" value={form.pointsQuota} onChange={(e) => setForm({...form, pointsQuota: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold text-gray-900 outline-none focus:border-orange-500" /></div>
                        </div>
                    </section>
                    <hr className="border-gray-100" />
                    <section>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center"><Lock className="w-4 h-4 mr-2" /> Status</h4>
                        <div className="flex gap-2">
                             <button onClick={() => setForm({...form, status: 'Active'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${form.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-transparent text-gray-500'}`}>Active</button>
                             <button onClick={() => setForm({...form, status: 'Inactive'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${form.status === 'Inactive' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-transparent text-gray-500'}`}>Blocked</button>
                        </div>
                    </section>
                </div>
                <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-white text-sm">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black text-sm flex items-center justify-center shadow-lg">{isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}</button>
                </div>
            </div>
        </div>
    );
});

// --- MAIN COMPONENT ---

export const StoreManagement: React.FC = () => {
  const { addNotification } = useNotification();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      const data = await StoreService.getAllStores();
      setStores(data);
    } catch (e) {
      addNotification('Error', 'Failed to load distributors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (store: any) => {
      setSelectedStore(store);
      setEditModalOpen(true);
  };

  const handleUpdateStore = async (updatedData: any) => {
      if (!selectedStore) return;
      try {
          await StoreService.updateStoreSettings(selectedStore.name, {
              ...updatedData,
              slug: selectedStore.slug
          });
          setStores(prev => prev.map(s => s.name === selectedStore.name ? { 
              ...s, 
              ...updatedData,
              accountStatus: updatedData.status,
              stats: { ...s.stats, customerQuota: updatedData.customerQuota, pointsQuota: updatedData.pointsQuota }
          } : s));
          setEditModalOpen(false);
          addNotification('Success', 'Store updated', 'success');
      } catch (e) {
          addNotification('Error', 'Update failed', 'error');
      }
  };

  const handleCreateStore = async (data: any) => {
      if (!data.name || !data.mobile) throw new Error("Missing fields");
      const result = await StoreService.createStore(data);
      await loadStores();
      addNotification('Success', 'Store created', 'success');
      return result;
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1 text-gray-500"><Store className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Total Stores</span></div>
                <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1 text-gray-500"><Printer className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Total Coupons</span></div>
                <p className="text-2xl font-bold text-orange-600">{stores.reduce((acc, s) => acc + (s.stats?.couponsGenerated || 0), 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-1 text-gray-500"><FileText className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Bills Approved</span></div>
                <p className="text-2xl font-bold text-green-600">{stores.reduce((acc, s) => acc + (s.stats?.billsApproved || 0), 0).toLocaleString()}</p>
            </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-lg">Partner Stores</h3>
            <button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-lg active:scale-95">
                <Plus className="w-5 h-5" /> <span>Add New Store</span>
            </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:border-orange-200 transition-colors">
                    <div className="p-4 flex justify-between items-start border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-lg text-gray-700 shadow-sm">{store.initials || 'ST'}</div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-base leading-tight">{store.name}</h4>
                                <div className="flex items-center text-xs text-gray-500 mt-1"><MapPin className="w-3 h-3 mr-1" />{store.slug || 'No Location'}</div>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${store.accountStatus === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{store.accountStatus}</div>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4 text-center">
                        <div><p className="text-2xl font-bold text-gray-900">{store.stats?.couponsGenerated || 0}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Coupons</p></div>
                        <div><p className="text-2xl font-bold text-orange-600">{((store.stats?.pointsGenerated || 0) / 1000).toFixed(1)}k</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Points</p></div>
                    </div>
                    <div className="mt-auto p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-xs font-bold text-gray-500">{store.mobile}</div>
                        <button onClick={() => openEdit(store)} className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"><Settings className="w-3.5 h-3.5 mr-1.5" /> Controls</button>
                    </div>
                </div>
            ))}
            {stores.length === 0 && <div className="col-span-full py-12 text-center text-gray-400"><Store className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No stores added yet.</p></div>}
        </div>

        <CreateStoreModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateStore} />
        <EditStoreModal isOpen={editModalOpen} store={selectedStore} onClose={() => setEditModalOpen(false)} onSave={handleUpdateStore} />
    </div>
  );
};
