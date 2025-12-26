
import React from 'react';
import { Award, Gift, Zap, FileText, CheckCircle, Smartphone, MessageCircle, ScanLine, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '../config';

interface PromotionalBrochureProps {
  brandName: string;
  primaryColor: string;
  fontFamily: string;
  borderRadius: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  contactInfo: string;
}

export const PromotionalBrochure: React.FC<PromotionalBrochureProps> = ({ 
  brandName, 
  primaryColor, 
  fontFamily, 
  borderRadius, 
  headline,
  subheadline,
  ctaText,
  contactInfo 
}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vistaengage.com';

  return (
    <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-0 m-0 overflow-visible text-black" style={{ fontFamily }}>
      <style>{`
        @media print {
          @page { margin: 0; size: A4 vertical; }
          body * { visibility: hidden; }
          .brochure-container, .brochure-container * { visibility: visible; }
          .brochure-container { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 210mm; 
            height: 297mm; 
            background: white;
            color: #111;
          }
        }
      `}</style>

      <div className="brochure-container flex flex-col h-full">
        {/* Header Hero Area */}
        <div className="h-[40%] relative overflow-hidden flex flex-col justify-center px-16" style={{ backgroundColor: primaryColor }}>
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
           
           <div className="relative z-10 flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-xl" style={{ borderRadius }}>
                 <Award className="w-10 h-10" style={{ color: primaryColor }} />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight uppercase">{brandName}</h1>
           </div>

           <div className="relative z-10 max-w-2xl">
              <h2 className="text-7xl font-black text-white leading-[0.9] tracking-tighter mb-4 uppercase italic">
                {headline}
              </h2>
              <p className="text-white/80 text-xl font-bold mb-8 italic">{subheadline}</p>
              <div className="inline-block px-6 py-3 bg-white font-black text-xl tracking-widest uppercase shadow-2xl" style={{ color: primaryColor, borderRadius }}>
                 {ctaText}
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-16 py-20 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-4 mb-12">
                 <div className="h-0.5 flex-1 bg-gray-100"></div>
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">How it Works</h3>
                 <div className="h-0.5 flex-1 bg-gray-100"></div>
              </div>

              <div className="grid grid-cols-3 gap-12 mb-20">
                 {[
                    { icon: ScanLine, title: "Scan QR", desc: "Find the sticker on our product packaging and scan with your phone." },
                    { icon: FileText, title: "Send Bill", desc: "Take a clear photo of the invoice and upload it to the app instantly." },
                    { icon: Gift, title: "Earn Cash", desc: "Points are added to your wallet immediately. Withdraw direct to your bank." }
                 ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                       <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mb-6 shadow-inner" style={{ borderRadius, color: primaryColor }}>
                          <step.icon className="w-10 h-10" />
                       </div>
                       <h4 className="text-xl font-black uppercase mb-3 text-gray-900">{step.title}</h4>
                       <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                 ))}
              </div>

              <div className="bg-gray-50 p-10 flex items-center justify-between border-l-8" style={{ borderRadius, borderColor: primaryColor }}>
                 <div>
                    <h4 className="text-3xl font-black text-gray-900 mb-2 uppercase">Ready to get started?</h4>
                    <p className="text-gray-600 font-bold">Simply visit our portal and login with your mobile number.</p>
                 </div>
                 <div className="flex flex-col items-center gap-3">
                    <div className="bg-white p-3 shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(baseUrl)}&color=000000&bgcolor=ffffff&margin=0`} 
                          alt="Portal QR" 
                          className="w-24 h-24"
                        />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scan to Open</span>
                 </div>
              </div>
           </div>

           {/* Footer */}
           <div className="flex justify-between items-end border-t-2 border-gray-100 pt-12">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <span className="font-black text-lg text-gray-900">{contactInfo}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-gray-500">Support via WhatsApp 24/7</span>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Powered By</p>
                 <div className="flex items-center gap-2 justify-end opacity-40">
                    <Zap className="w-4 h-4" />
                    <span className="font-black text-sm uppercase tracking-tighter">VistaDeck Loyalty</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
