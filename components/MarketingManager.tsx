import React, { useState, useEffect, memo } from 'react';
import { Megaphone, Plus, Trash2, Eye, EyeOff, Image as ImageIcon, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { PromoBanner, User } from '../types';
import { MarketingService } from '../services/backend';
import { useNotification } from '../contexts/NotificationContext';

// --- SUB-COMPONENT ---
const CreateBannerModal = memo(({ isOpen, onClose, onCreate, user }: { isOpen: boolean, onClose: () => void, onCreate: (data: any) => Promise<void>, user?: User }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [link, setLink] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if(isOpen) {
            setTitle(''); setDesc(''); setLink(''); setPreviewUrl('');
        }
    }, [isOpen]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async () => {
        if (!title || !previewUrl) return;
        setIsCreating(true);
        const bannerData = {
            title, description: desc, imageUrl: previewUrl, link: link || undefined,
            isActive: true, createdBy: user?.name || 'Admin', storeId: user?.role === 'STORE_ADMIN' ? user.name : undefined
        };
        await onCreate(bannerData);
        setIsCreating(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h3 className="text-xl font-bold text-gray-900">New Promotion</h3></div>
              <div className="p-6 space-y-4">
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Campaign Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Diwali Sale" className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-orange-500 font-bold" /></div>
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label><textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-orange-500 text-sm" /></div>
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Action Link</label><div className="relative"><LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-orange-500 text-sm" /></div></div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Banner Image</label>
                    <div onClick={() => document.getElementById('promo-file')?.click()} className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
                       {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" /> : <><ImageIcon className="w-8 h-8 text-gray-300 mb-2" /><span className="text-xs text-gray-400 font-bold">Upload Image</span></>}
                       <input id="promo-file" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                 <button onClick={onClose} className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-white transition-colors">Cancel</button>
                 <button onClick={handleSubmit} disabled={isCreating} className="flex-1 py-3 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors flex items-center justify-center">{isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Live'}</button>
              </div>
           </div>
        </div>
    );
});

interface MarketingManagerProps {
  user?: User;
}

// --- MAIN COMPONENT ---
export const MarketingManager: React.FC<MarketingManagerProps> = ({ user }) => {
  const { addNotification } = useNotification();
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { loadBanners(); }, [user]);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const storeId = user?.role === 'STORE_ADMIN' ? user.name : undefined;
      const data = await MarketingService.getAllBanners(storeId);
      setBanners(data);
    } catch (e) {
      addNotification('Error', 'Failed to load promotions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (bannerData: any) => {
    try {
      await MarketingService.createBanner(bannerData);
      addNotification('Success', 'Promotion created', 'success');
      setIsModalOpen(false);
      loadBanners();
    } catch (e) {
      addNotification('Error', 'Creation failed', 'error');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await MarketingService.toggleBanner(id);
      setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    } catch (e) {
      addNotification('Error', 'Update failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotion?')) return;
    try {
      await MarketingService.deleteBanner(id);
      setBanners(prev => prev.filter(b => b.id !== id));
      addNotification('Success', 'Deleted', 'success');
    } catch (e) {
      addNotification('Error', 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h2 className="text-xl font-bold mb-1 flex items-center text-gray-900"><Megaphone className="w-5 h-5 mr-2 text-orange-600" /> Upsell & Promotions</h2>
            <p className="text-gray-500 text-sm">Push advertising banners to your partners.</p>
         </div>
         <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 transition-all flex items-center"><Plus className="w-4 h-4 mr-2" /> Create Promotion</button>
      </div>

      {loading ? <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-gray-300 animate-spin" /></div> : banners.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 border-dashed">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><ImageIcon className="w-8 h-8 text-gray-300" /></div>
           <h3 className="text-gray-900 font-bold mb-2">No Active Promotions</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className={`bg-white rounded-xl overflow-hidden border transition-all ${banner.isActive ? 'border-gray-200 shadow-sm' : 'border-gray-100 opacity-70'}`}>
               <div className="aspect-video bg-gray-100 relative group">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <button onClick={() => handleToggle(banner.id)} className="p-2 bg-white rounded-full text-gray-800 hover:text-orange-600 transition-colors">{banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                     <button onClick={() => handleDelete(banner.id)} className="p-2 bg-white rounded-full text-gray-800 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase ${banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{banner.isActive ? 'Active' : 'Hidden'}</div>
               </div>
               <div className="p-4">
                  <h3 className="font-bold text-gray-900 truncate">{banner.title}</h3>
                  {banner.link && <div className="flex items-center mt-2 text-xs text-blue-600 font-medium truncate"><LinkIcon className="w-3 h-3 mr-1" /><span className="truncate">{banner.link}</span></div>}
               </div>
            </div>
          ))}
        </div>
      )}
      <CreateBannerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreate} user={user} />
    </div>
  );
};