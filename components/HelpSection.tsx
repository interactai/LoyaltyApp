
import React, { useState, memo } from 'react';
import { 
  HelpCircle, ChevronDown, MessageCircle, Phone, ArrowRight, 
  ScanLine, Wallet, FileText, CheckCircle, Zap, TrendingUp, 
  Printer, Smartphone, ShieldCheck, AppWindow
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRole } from '../types';

// --- SUB-COMPONENT: HELP HERO ---
const HelpHero = memo(({ t }: { t: any }) => (
  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mb-8 border border-gray-800">
    <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-600 rounded-lg shadow-lg">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-black tracking-tight">{t.helpTitle}</h2>
      </div>
      <p className="text-gray-400 mb-8 max-w-lg text-lg font-medium leading-relaxed">{t.faqContact}</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <a 
          href="https://wa.me/919923993301" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-green-900/20 active:scale-95"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          WHATSAPP SUPPORT
        </a>
        <a 
          href="tel:+919923993301" 
          className="flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm transition-all border border-white/10 active:scale-95"
        >
          <Phone className="w-5 h-5 mr-2" />
          CALL US
        </a>
      </div>
    </div>
  </div>
));

// --- SUB-COMPONENT: APP HANDLING GUIDE ---
const AppHandlingGuide = memo(({ t, isMember }: { t: any, isMember: boolean }) => {
  const steps = isMember ? [
    { title: t.guide_step1_title, desc: t.guide_step1_desc, icon: ScanLine, color: "text-orange-600", bg: "bg-orange-50" },
    { title: t.guide_step2_title, desc: t.guide_step2_desc, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { title: t.guide_step3_title, desc: t.guide_step3_desc, icon: Wallet, color: "text-green-600", bg: "bg-green-50" }
  ] : [
    { title: t.guide_store_step1_title, desc: t.guide_store_step1_desc, icon: Printer, color: "text-orange-600", bg: "bg-orange-50" },
    { title: t.guide_store_step2_title, desc: t.guide_store_step2_desc, icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
    { title: t.guide_store_step3_title, desc: t.guide_store_step3_desc, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-8">
        <AppWindow className="w-5 h-5 text-gray-400" />
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{t.guide_title || "App Handling Guide"}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-[40px] left-[15%] w-[70%] h-0.5 bg-gray-100 -z-0"></div>

        {steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border-4 border-white transition-transform group-hover:scale-110 duration-300 ${step.bg} ${step.color}`}>
              <step.icon className="w-9 h-9" strokeWidth={2.5} />
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-md">
                {idx + 1}
              </div>
            </div>
            <h4 className="font-black text-gray-900 text-lg mb-2 uppercase tracking-tight">{step.title}</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

// --- SUB-COMPONENT: KEY BENEFITS ---
const KeyBenefits = memo(({ t }: { t: any }) => {
  const benefits = [
    { title: t.benefit_1_title, desc: t.benefit_1_desc, icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
    { title: t.benefit_2_title, desc: t.benefit_2_desc, icon: Smartphone, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: t.benefit_3_title, desc: t.benefit_3_desc, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {benefits.map((benefit, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group border-b-4 hover:border-b-gray-900">
          <div className={`w-12 h-12 ${benefit.bg} ${benefit.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
            <benefit.icon className="w-6 h-6" />
          </div>
          <h4 className="font-black text-gray-900 text-sm mb-2 uppercase tracking-wide">{benefit.title}</h4>
          <p className="text-xs text-gray-500 font-medium leading-normal">{benefit.desc}</p>
        </div>
      ))}
    </div>
  );
});

// --- SUB-COMPONENT: FAQ ACCORDION ---
const FaqAccordion = memo(({ t, faqKeys }: { t: any, faqKeys: string[] }) => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 bg-gray-50/30">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{t.faqTitle}</h3>
      </div>
      
      <div className="divide-y divide-gray-50">
        {faqKeys.map((key) => {
          const qKey = `faq_${key}`;
          const aKey = `faq_${key.replace('q', 'a')}`;
          const isOpen = openIndex === key;
          
          return (
            <div key={key} className="bg-white">
              <button 
                onClick={() => toggleAccordion(key)}
                className="w-full px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left focus:outline-none group"
              >
                <span className={`font-bold text-base transition-colors ${isOpen ? 'text-orange-600' : 'text-gray-800'}`}>
                  {t[qKey] as string}
                </span>
                <div className={`p-1.5 rounded-lg transition-all ${isOpen ? 'bg-orange-600 text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 border-b border-gray-50' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-6 pt-2 text-sm text-gray-600 leading-relaxed font-medium">
                  <div className="p-4 bg-orange-50/30 rounded-2xl border border-orange-50/50">
                    {t[aKey] as string}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// --- MAIN HELP SECTION COMPONENT ---
export const HelpSection: React.FC<HelpSectionProps> = ({ userRole = 'MEMBER' }) => {
  const { t } = useLanguage();
  const isMember = userRole === 'MEMBER';

  const getFaqKeys = () => {
    switch (userRole) {
      case 'STORE_ADMIN':
        return ['store_q1', 'store_q2', 'store_q3', 'store_q4'];
      case 'SUPER_ADMIN':
        return ['admin_q1', 'admin_q2', 'admin_q3'];
      default: // MEMBER
        return ['q1', 'q2', 'q3', 'q4', 'q5'];
    }
  };

  const faqKeys = getFaqKeys();

  return (
    <div className="space-y-2 animate-fade-in max-w-5xl mx-auto pb-24 lg:pb-10">
      <HelpHero t={t} />
      <AppHandlingGuide t={t} isMember={isMember} />
      <KeyBenefits t={t} />
      <FaqAccordion t={t} faqKeys={faqKeys} />
    </div>
  );
};

interface HelpSectionProps {
  userRole?: UserRole;
}
