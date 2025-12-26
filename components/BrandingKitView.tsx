

import React, { useState, useRef } from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Image as ImageIcon, 
  ArrowLeft, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Monitor, 
  Smartphone,
  Layers,
  Zap,
  Award,
  Users,
  Megaphone,
  Download,
  Eye,
  FileText,
  Printer,
  Sparkle,
  Loader2,
  Trash2,
  Camera,
  Type as TypeIcon
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { useNotification } from '../contexts/NotificationContext';
import { ViewState } from '../types';
import { PromotionalBrochure } from './PromotionalBrochure';
// Import GoogleGenAI according to guidelines
import { GoogleGenAI } from "@google/genai";

const PRIMARY_COLORS = [
  { name: 'Safety Orange', value: '#ea580c', bg: 'bg-orange-600' },
  { name: 'Deep Royal', value: '#1e3a8a', bg: 'bg-blue-900' },
  { name: 'Forest Green', value: '#166534', bg: 'bg-green-800' },
  { name: 'Modern Black', value: '#111827', bg: 'bg-gray-900' },
  { name: 'Crimson Red', value: '#b91c1c', bg: 'bg-red-700' },
  { name: 'Indigo Blue', value: '#4338ca', bg: 'bg-indigo-700' },
  { name: 'Teal Teal', value: '#0f766e', bg: 'bg-teal-700' },
  { name: 'Vibrant Purple', value: '#7e22ce', bg: 'bg-purple-700' },
];

const FONTS = [
  { name: 'Inter (Modern)', value: 'Inter, sans-serif' },
  { name: 'Roboto (Industrial)', value: 'Roboto, sans-serif' },
  { name: 'Outfit (Trendy)', value: 'Outfit, sans-serif' },
  { name: 'Poppins (Soft)', value: 'Poppins, sans-serif' },
];

const RADIUS_OPTIONS = [
  { name: 'Sharp', value: '0px' },
  { name: 'Medium', value: '12px' },
  { name: 'Large', value: '24px' },
  { name: 'Full', value: '999px' },
];

const CREATIVE_THEMES = [
  { id: 'industrial', label: 'themeIndustrial', prompt: 'Modern cinematic industrial warehouse, construction site, engineering tools, professional lighting' },
  { id: 'modern', label: 'themeModern', prompt: 'Minimalist luxury tech office, abstract geometric shapes, soft gradient lighting, clean space' },
  { id: 'festive', label: 'themeFestive', prompt: 'Vibrant Indian celebration, decorative lights, confetti, gifting spirit, premium retail environment' },
];

const CREATIVE_FORMATS = [
  { id: 'status', label: 'whatsappStatus', aspectRatio: '9:16' },
  { id: 'post', label: 'instaPost', aspectRatio: '1:1' },
];

export const BrandingKitView: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { settings, updateSetting } = useSettings();
  const { addNotification } = useNotification();
  const creativeRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'ui' | 'marketing'>('colors');
  const [isApplying, setIsApplying] = useState(false);

  // Local state for branding
  const [selectedColor, setSelectedColor] = useState(settings.primaryColor || '#ea580c');
  const [selectedFont, setSelectedFont] = useState(settings.fontFamily || 'Inter, sans-serif');
  const [selectedRadius, setSelectedRadius] = useState(settings.borderRadius || '24px');
  
  // Marketing / AI Lab State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [creativeTheme, setCreativeTheme] = useState('industrial');
  const [creativeFormat, setCreativeFormat] = useState('status');
  
  // Customizable Creative Text using expanded GeneralSettings fields
  const [creativeHeadline, setCreativeHeadline] = useState(settings.creativeHeadline || 'Build Faster. Earn Harder.');
  const [creativeSubheadline, setCreativeSubheadline] = useState(settings.creativeSubheadline || 'Exclusive benefits for our valued partners.');
  const [creativeCTA, setCreativeCTA] = useState(settings.creativeCTA || 'Join the Rewards');
  const [creativeContact, setCreativeContact] = useState(settings.creativeContact || '+91 99000 88000');

  const handleApply = async () => {
    setIsApplying(true);
    updateSetting('primaryColor', selectedColor);
    updateSetting('fontFamily', selectedFont);
    updateSetting('borderRadius', selectedRadius);
    updateSetting('creativeHeadline', creativeHeadline);
    updateSetting('creativeSubheadline', creativeSubheadline);
    updateSetting('creativeCTA', creativeCTA);
    updateSetting('creativeContact', creativeContact);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsApplying(false);
    addNotification('Branding Updated', 'New visual identity applied across platform.', 'success');
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Use named parameter for apiKey as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const theme = CREATIVE_THEMES.find(th => th.id === creativeTheme);
      const format = CREATIVE_FORMATS.find(f => f.id === creativeFormat);

      const promptText = `A professional high-fidelity promotional advertisement background for a B2B loyalty program. 
                      Subject: ${theme?.prompt}. 
                      The color palette should prominently feature hex code ${selectedColor}. 
                      Context: ${creativeHeadline}. ${creativeSubheadline}.
                      Style: Commercial photography, high dynamic range, cinematic blur, minimalist. 
                      No text in the image. No logos.`;

      // Use ai.models.generateContent directly with model name
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: promptText }] },
        config: {
          imageConfig: {
            // aspectRatio set based on selection
            aspectRatio: format?.aspectRatio as any || "9:16"
          }
        }
      });

      // Iterate through parts to find the image part according to guidelines
      if (response.candidates && response.candidates[0] && response.candidates[0].content) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
              break;
            }
          }
      }
      addNotification('Success', 'AI Creative Ready!', 'success');
    } catch (error) {
      console.error(error);
      addNotification('Error', 'Failed to generate image. Please check API Key.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedColor('#ea580c');
    setSelectedFont('Inter, sans-serif');
    setSelectedRadius('24px');
    setCreativeHeadline('Build Faster. Earn Harder.');
    setCreativeSubheadline('Exclusive benefits for our valued partners.');
    setCreativeCTA('Join the Rewards');
    setCreativeContact('+91 99000 88000');
    addNotification('Reset', 'Branding reset to system defaults.', 'info');
  };

  const handleDownloadBrochure = () => {
    addNotification('Generating Brochure', 'Preparing your marketing materials...', 'info');
    setTimeout(() => {
        window.print();
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20">
      {/* Hidden Brochure (kept for print function) */}
      <PromotionalBrochure 
        brandName={settings.qrBrandName || "Partner Rewards"}
        primaryColor={selectedColor}
        fontFamily={selectedFont}
        borderRadius={selectedRadius}
        headline={creativeHeadline}
        subheadline={creativeSubheadline}
        ctaText={creativeCTA}
        contactInfo={creativeContact}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate(ViewState.SETTINGS)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-orange-600" />
              {t.brandingKit}
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">{t.brandingKitSubtitle}</p>
          </div>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleReset}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
            >
                <RefreshCw className="w-4 h-4" />
                {t.resetDefaults}
            </button>
            <button 
                onClick={handleApply}
                disabled={isApplying}
                className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
                {isApplying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {t.applyBranding}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Panels */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
                <button 
                    onClick={() => setActiveTab('colors')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'colors' ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Palette className="w-4 h-4" />
                    Colors
                </button>
                <button 
                    onClick={() => setActiveTab('typography')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'typography' ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Type className="w-4 h-4" />
                    Fonts
                </button>
                <button 
                    onClick={() => setActiveTab('ui')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'ui' ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Layers className="w-4 h-4" />
                    Personality
                </button>
                <button 
                    onClick={() => setActiveTab('marketing')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'marketing' ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Sparkle className="w-4 h-4" />
                    Creative Lab
                </button>
            </div>

            <div className="p-8">
                {activeTab === 'colors' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">{t.primaryColor}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {PRIMARY_COLORS.map((c) => (
                                    <button 
                                        key={c.value}
                                        onClick={() => setSelectedColor(c.value)}
                                        className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${selectedColor === c.value ? 'border-orange-500 bg-orange-50/50' : 'border-gray-50 hover:border-gray-200'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl ${c.bg} shadow-lg mb-3 flex items-center justify-center text-white`}>
                                            {selectedColor === c.value && <Check className="w-6 h-6" />}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100">
                             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Custom Hex Code</h3>
                             <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <div 
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md border border-gray-200" 
                                        style={{ backgroundColor: selectedColor }}
                                    />
                                    <input 
                                        type="text" 
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:bg-white focus:border-orange-500 outline-none transition-all"
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'typography' && (
                    <div className="space-y-6 animate-fade-in-up">
                         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">{t.typography}</h3>
                         <div className="space-y-3">
                            {FONTS.map((font) => (
                                <button 
                                    key={font.value}
                                    onClick={() => setSelectedFont(font.value)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${selectedFont === font.value ? 'border-orange-500 bg-orange-50/50' : 'border-gray-50 hover:border-gray-200 bg-gray-50'}`}
                                >
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-gray-900" style={{ fontFamily: font.value }}>The quick brown fox jumps over the lazy dog</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">{font.name}</p>
                                    </div>
                                    {selectedFont === font.value && <Check className="w-5 h-5 text-orange-600" />}
                                </button>
                            ))}
                         </div>
                    </div>
                )}

                {activeTab === 'ui' && (
                    <div className="space-y-8 animate-fade-in-up">
                         <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">{t.borderRadius}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {RADIUS_OPTIONS.map((opt) => (
                                    <button 
                                        key={opt.value}
                                        onClick={() => setSelectedRadius(opt.value)}
                                        className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${selectedRadius === opt.value ? 'border-orange-500 bg-orange-50/50' : 'border-gray-50 hover:border-gray-200'}`}
                                    >
                                        <div 
                                            className="w-12 h-12 bg-gray-800 mb-4 border border-gray-600 flex items-center justify-center text-white" 
                                            style={{ borderRadius: opt.value }}
                                        />
                                        <span className="text-[10px] font-bold text-gray-600 uppercase">{opt.name}</span>
                                    </button>
                                ))}
                            </div>
                         </div>
                    </div>
                )}

                {activeTab === 'marketing' && (
                    <div className="space-y-8 animate-fade-in-up">
                         <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">{t.creativeTheme}</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {CREATIVE_THEMES.map(theme => (
                                            <button 
                                                key={theme.id}
                                                onClick={() => setCreativeTheme(theme.id)}
                                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${creativeTheme === theme.id ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-sm' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                                            >
                                                <span className="font-bold text-sm">{(t as any)[theme.label]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block flex items-center gap-2">
                                        <TypeIcon className="w-3 h-3" /> Custom Creative Text
                                    </label>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Headline</label>
                                            <input 
                                                type="text" 
                                                value={creativeHeadline}
                                                onChange={(e) => setCreativeHeadline(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-orange-500 transition-all"
                                                placeholder="Build Faster. Earn Harder."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Sub-headline</label>
                                            <input 
                                                type="text" 
                                                value={creativeSubheadline}
                                                onChange={(e) => setCreativeSubheadline(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-orange-500 transition-all"
                                                placeholder="Exclusive benefits for partners."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Button text</label>
                                                <input 
                                                    type="text" 
                                                    value={creativeCTA}
                                                    onChange={(e) => setCreativeCTA(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-black text-[10px] uppercase tracking-wider outline-none focus:border-orange-500 transition-all"
                                                    placeholder="Join Now"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Contact info</label>
                                                <input 
                                                    type="text" 
                                                    value={creativeContact}
                                                    onChange={(e) => setCreativeContact(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-orange-500 transition-all"
                                                    placeholder="+91..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">{t.creativeFormat}</label>
                                    <div className="flex gap-2">
                                        {CREATIVE_FORMATS.map(format => (
                                            <button 
                                                key={format.id}
                                                onClick={() => setCreativeFormat(format.id)}
                                                className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${creativeFormat === format.id ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                                            >
                                                <span className="font-bold text-[10px] uppercase">{(t as any)[format.label]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        onClick={generateWithAI}
                                        disabled={isGenerating}
                                        className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkle className="w-5 h-5" />}
                                        {t.generateCreative}
                                    </button>
                                    <button 
                                        onClick={handleDownloadBrochure}
                                        className="w-full mt-3 py-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Printer className="w-4 h-4" />
                                        Print Brochure
                                    </button>
                                </div>
                            </div>

                            {/* PREVIEW OF CREATIVE */}
                            <div className="w-full md:w-80 shrink-0">
                                <div className="space-y-4 sticky top-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">{t.appPreview}</label>
                                    <div 
                                        ref={creativeRef}
                                        className={`relative bg-gray-200 overflow-hidden shadow-2xl transition-all duration-500 ${creativeFormat === 'status' ? 'aspect-[9/16]' : 'aspect-square'}`}
                                        style={{ borderRadius: selectedRadius }}
                                    >
                                        {isGenerating ? (
                                            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
                                                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                                                <p className="text-xs font-bold text-gray-400 uppercase animate-pulse">{t.generatingCreative}</p>
                                            </div>
                                        ) : generatedImage ? (
                                            <>
                                                <img src={generatedImage} className="absolute inset-0 w-full h-full object-cover" alt="AI Base" />
                                                <div className="absolute inset-0 bg-black/40"></div>
                                                {/* Branding Overlays */}
                                                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white" style={{ fontFamily: selectedFont }}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg" style={{ color: selectedColor }}>
                                                            <Award className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-tighter shadow-sm">{settings.qrBrandName || "VistaDeck Loyalty"}</span>
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <h4 className="text-3xl font-black uppercase italic leading-[0.85] tracking-tighter drop-shadow-lg">{creativeHeadline}</h4>
                                                        <p className="text-[10px] font-bold opacity-90 drop-shadow-md">{creativeSubheadline}</p>
                                                        <div className="inline-block px-4 py-1.5 bg-white text-[10px] font-black uppercase tracking-widest shadow-xl" style={{ color: selectedColor, borderRadius: '6px' }}>
                                                            {creativeCTA}
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 border-t border-white/20 flex justify-between items-end">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] opacity-70 uppercase font-bold">Connect with us</p>
                                                            <p className="text-xs font-black drop-shadow-md">{creativeContact}</p>
                                                        </div>
                                                        <div className="w-14 h-14 bg-white p-1.5 rounded-xl shadow-lg border border-white/20">
                                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://vistadeck.com`} className="w-full h-full" alt="QR" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 m-4 rounded-[2rem]">
                                                <Camera className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-xs font-bold text-gray-300 uppercase">Customize text & Generate AI background</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {generatedImage && (
                                        <button 
                                            onClick={() => addNotification('Info', 'Image saved to gallery.', 'success')}
                                            className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:bg-black transition-all"
                                        >
                                            <Download className="w-4 h-4" />
                                            {t.downloadCreative}
                                        </button>
                                    )}
                                </div>
                            </div>
                         </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Right: Dashboard Live Preview */}
        <div className="lg:col-span-5">
            <div className="sticky top-8">
                <div className="bg-gray-900 rounded-[3rem] p-8 shadow-2xl border border-gray-800 relative">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                    </div>

                    <div className="flex items-center justify-between mb-8 mt-4">
                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest">{t.appPreview}</h3>
                        <div className="flex gap-2">
                            <Monitor className="w-3.5 h-3.5 text-white/30" />
                            <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                    </div>

                    {/* MOCK APP SCREEN */}
                    <div className="bg-gray-100 min-h-[500px] rounded-[2rem] overflow-hidden flex flex-col shadow-inner" style={{ fontFamily: selectedFont }}>
                        <div className="p-4 bg-white flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 flex items-center justify-center text-white" style={{ backgroundColor: selectedColor, borderRadius: '8px' }}>
                                    <Zap className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black text-gray-900">{settings.qrBrandName || "VistaDeck"}</span>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                        </div>

                        <div className="p-5 flex-1 space-y-4">
                            <div className="p-5 bg-gray-900 text-white shadow-xl relative overflow-hidden" style={{ borderRadius: selectedRadius }}>
                                <div className="relative z-10">
                                    <p className="text-[8px] text-white/50 uppercase font-bold mb-1">Wallet Balance</p>
                                    <h4 className="text-2xl font-black">₹12,450</h4>
                                    <button 
                                        className="mt-4 px-4 py-2 text-[10px] font-bold text-white shadow-lg" 
                                        style={{ backgroundColor: selectedColor, borderRadius: `calc(${selectedRadius} / 2)` }}
                                    >
                                        WITHDRAW
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-4 shadow-sm flex flex-col items-center gap-2" style={{ borderRadius: selectedRadius }}>
                                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center" style={{ borderRadius: '50%', color: selectedColor }}>
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase text-gray-400">Scan QR</span>
                                </div>
                                <div className="bg-white p-4 shadow-sm flex flex-col items-center gap-2" style={{ borderRadius: selectedRadius }}>
                                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center" style={{ borderRadius: '50%', color: selectedColor }}>
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase text-gray-400">Partners</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};