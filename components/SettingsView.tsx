
import React, { useState } from 'react';
import { 
  Moon, Sun, Monitor, Save, Globe, Building2, 
  Settings, Shield, Bell, Camera, 
  Wallet, Info, Lock, Key, 
  CheckCircle2, Loader2, Plus, QrCode
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_CONFIG } from '../config';
import { useNotification } from '../contexts/NotificationContext';
import { useSettings } from '../contexts/SettingsContext';
import { ViewState } from '../types';

type SettingTab = 'general' | 'profile' | 'loyalty' | 'notifications' | 'security';

interface SettingsViewProps {
  onNavigate?: (view: ViewState) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { addNotification } = useNotification();
  const { settings, updateSetting } = useSettings();

  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    businessName: 'Mumbai Distributor',
    ownerName: 'Mahesh Kumar',
    email: 'mumbai@partner.com',
    phone: '8888888888',
    address: 'Sector 4, MIDC, Mumbai, MH',
    gstNumber: '27AAAAA0000A1Z5'
  });

  const [loyaltyRules, setLoyaltyRules] = useState({
    pointsPerRupee: 1,
    minRedemption: 100,
    enableTiers: true
  });

  const [qrLabels, setQrLabels] = useState({
    qrBrandName: settings.qrBrandName || BRAND_CONFIG.appName,
    qrMysteryText: settings.qrMysteryText || 'Mystery Reward',
    qrScanText: settings.qrScanText || 'Scan to Reveal'
  });

  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    newMemberAlerts: false
  });

  const handleSave = async () => {
    setIsSaving(true);
    updateSetting('qrBrandName', qrLabels.qrBrandName);
    updateSetting('qrMysteryText', qrLabels.qrMysteryText);
    updateSetting('qrScanText', qrLabels.qrScanText);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    addNotification('Settings Saved', 'Your preferences have been updated successfully.', 'success');
  };

  const TabButton = ({ id, label, icon: Icon }: { id: SettingTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full ${
        activeTab === id 
        ? `bg-orange-600 text-white shadow-lg shadow-orange-200` 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in pb-20 lg:pb-0">
      <aside className="w-full lg:w-64 space-y-2 shrink-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <TabButton id="general" label="General Preferences" icon={Settings} />
          <TabButton id="profile" label="Store Profile" icon={Building2} />
          <TabButton id="loyalty" label="Loyalty & QR" icon={Wallet} />
          <TabButton id="notifications" label="Notifications" icon={Bell} />
          <TabButton id="security" label="Security" icon={Shield} />
        </div>
        
        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
           <div className="flex items-center gap-3 mb-2 text-orange-700">
              <Info className="w-5 h-5" />
              <span className="font-bold text-sm">Need Help?</span>
           </div>
           <p className="text-xs text-orange-600 leading-relaxed">
             Our support team is available 24/7 to help you configure your partner platform.
           </p>
        </div>
      </aside>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center">
            <div>
               <h2 className="text-xl font-bold text-gray-900 capitalize">{activeTab} Settings</h2>
               <p className="text-sm text-gray-500">Manage your account configurations.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50`}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-10 animate-fade-in-up">
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">{t.appearance}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { v: 'light' as const, i: Sun, l: t.lightMode },
                    { v: 'dark' as const, i: Moon, l: t.darkMode },
                    { v: 'system' as const, i: Monitor, l: t.systemDefault }
                  ].map(opt => (
                    <button
                      key={opt.v}
                      onClick={() => setTheme(opt.v)}
                      className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                        theme === opt.v 
                        ? `border-orange-500 bg-orange-50 text-orange-700` 
                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <opt.i className="w-8 h-8 mb-3" />
                      <span className="font-bold text-sm">{opt.l}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-gray-900">{t.language}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { c: 'en' as const, l: 'English', n: 'International' },
                    { c: 'hi' as const, l: 'Hindi', n: 'हिंदी' }
                  ].map(opt => (
                    <button
                      key={opt.c}
                      onClick={() => setLanguage(opt.c)}
                      className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                        language === opt.c 
                        ? `border-orange-500 bg-orange-50 text-orange-700` 
                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-2xl font-black mb-1">{opt.c.toUpperCase()}</span>
                      <span className="font-bold text-sm">{opt.l}</span>
                      <span className="text-[10px] opacity-70 uppercase tracking-widest">{opt.n}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                 <div className="relative group">
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:bg-gray-200 transition-colors">
                       <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-orange-600 text-white rounded-lg shadow-lg">
                       <Plus className="w-4 h-4" />
                    </button>
                 </div>
                 <div className="flex-1 w-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase">Business Name</label>
                          <input 
                            type="text" 
                            value={profile.businessName}
                            onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold" 
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase">GST Number</label>
                          <input 
                            type="text" 
                            value={profile.gstNumber}
                            onChange={(e) => setProfile({...profile, gstNumber: e.target.value.toUpperCase()})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono font-bold" 
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase">Contact Email</label>
                          <input 
                            type="email" 
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                          <input 
                            type="tel" 
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold" 
                          />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-gray-500 uppercase">Business Address</label>
                       <textarea 
                         rows={2} 
                         value={profile.address}
                         onChange={(e) => setProfile({...profile, address: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                       />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Points per ₹1 Spent</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         value={loyaltyRules.pointsPerRupee}
                         onChange={(e) => setLoyaltyRules({...loyaltyRules, pointsPerRupee: parseFloat(e.target.value)})}
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" 
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">PTS</span>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Min Redemption Amount</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         value={loyaltyRules.minRedemption}
                         onChange={(e) => setLoyaltyRules({...loyaltyRules, minRedemption: parseInt(e.target.value)})}
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" 
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mt-5 sm:col-span-2">
                    <div>
                       <p className="text-sm font-bold text-gray-900">Enable Tiers</p>
                       <p className="text-[10px] text-gray-500 uppercase font-bold">Bronze, Silver, Gold</p>
                    </div>
                    <button 
                      onClick={() => setLoyaltyRules({...loyaltyRules, enableTiers: !loyaltyRules.enableTiers})}
                      className={`w-12 h-6 rounded-full transition-all relative ${loyaltyRules.enableTiers ? 'bg-orange-600' : 'bg-gray-300'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${loyaltyRules.enableTiers ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <QrCode className="w-5 h-5 text-gray-400" />
                   <h3 className="font-bold text-gray-900">Sticker Label Customization</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-500 uppercase">QR Header (Brand Name)</label>
                     <input 
                       type="text" 
                       value={qrLabels.qrBrandName}
                       onChange={(e) => setQrLabels({...qrLabels, qrBrandName: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20" 
                       placeholder={BRAND_CONFIG.appName}
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-500 uppercase">Main Label (Mystery Text)</label>
                     <input 
                       type="text" 
                       value={qrLabels.qrMysteryText}
                       onChange={(e) => setQrLabels({...qrLabels, qrMysteryText: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20" 
                       placeholder="Mystery Reward"
                     />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                     <label className="text-xs font-bold text-gray-500 uppercase">Sub-label (Instruction)</label>
                     <input 
                       type="text" 
                       value={qrLabels.qrScanText}
                       onChange={(e) => setQrLabels({...qrLabels, qrScanText: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20" 
                       placeholder="Scan to Reveal"
                     />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-fade-in-up">
              {[
                { id: 'emailAlerts', title: 'Email Summaries', desc: 'Get weekly performance reports in your inbox.', icon: CheckCircle2 },
                { id: 'newMemberAlerts', title: 'New Member Signups', desc: 'Notification for every new retailer joining your network.', icon: CheckCircle2 },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                         <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-bold text-gray-900">{item.title}</p>
                         <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                   </div>
                   <button 
                      onClick={() => setNotifs({...notifs, [item.id]: !notifs[item.id as keyof typeof notifs]})}
                      className={`w-14 h-7 rounded-full transition-all relative ${notifs[item.id as keyof typeof notifs] ? 'bg-orange-600' : 'bg-gray-300'}`}
                    >
                       <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${notifs[item.id as keyof typeof notifs] ? 'left-8' : 'left-1'}`} />
                    </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in-up">
               <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                     <Key className="w-5 h-5 text-gray-400" />
                     <h3 className="font-bold text-gray-900">Change Password</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 max-w-md">
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange-500/20" />
                     </div>
                  </div>
                  <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">Update Password</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
