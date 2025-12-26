
import React from 'react';
import { Rocket, MessageCircle, Database, TrendingUp, CheckCircle, Zap, ArrowRight, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const VistaDeckUpsell: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Bot, title: "Automated Orders", desc: "WhatsApp bot that takes orders automatically 24/7." },
    { icon: Database, title: "Lead Collection", desc: "Capture customer data instantly via QR scans." },
    { icon: TrendingUp, title: "Smart Analytics", desc: "Track top-selling items and best customers." },
    { icon: MessageCircle, title: "Broadcast Marketing", desc: "Send bulk offers to all your customers in one click." },
  ];

  return (
    <div className="animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl text-white p-8 sm:p-16 mb-12">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-purple-200 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                <Rocket className="w-3 h-3" />
                New Release
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
               Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">VistaDeck</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
               The all-in-one automation platform for modern distributors. Capture leads, automate WhatsApp orders, and grow your sales on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <a 
                 href="https://wa.me/919923993301?text=I'm%20interested%20in%20VistaDeck%20Demo" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-sm shadow-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
               >
                 <Zap className="w-4 h-4 mr-2 text-purple-600" />
                 Book Free Demo
               </a>
               <button className="px-8 py-4 bg-transparent border border-white/20 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors text-white">
                 Learn More
               </button>
            </div>
         </div>
         
         {/* Floating visual element (abstract) */}
         <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
             <div className="w-64 h-80 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div>
                   <div className="flex-1">
                      <div className="h-2 w-20 bg-white/20 rounded mb-1.5"></div>
                      <div className="h-2 w-12 bg-white/10 rounded"></div>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="h-10 w-full bg-white/5 rounded-lg border border-white/5 p-2 flex items-center">
                      <div className="h-4 w-4 bg-white/20 rounded-full mr-2"></div>
                      <div className="h-2 w-24 bg-white/10 rounded"></div>
                   </div>
                   <div className="h-10 w-full bg-white/5 rounded-lg border border-white/5 p-2 flex items-center">
                      <div className="h-4 w-4 bg-white/20 rounded-full mr-2"></div>
                      <div className="h-2 w-16 bg-white/10 rounded"></div>
                   </div>
                   <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                      <p className="text-xs text-green-300 font-bold text-center">Order Received! 🚀</p>
                   </div>
                </div>
             </div>
         </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, idx) => (
             <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all group">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
             </div>
          ))}
      </div>

      {/* Comparison / Why Choose Us */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 text-center">
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Upgrade?</h2>
             <p className="text-gray-500">Compare VistaCoupons Standard vs VistaDeck Premium</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
             <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                   Current Plan
                </h3>
                <ul className="space-y-4">
                   {['Manual Bill Uploads', 'Basic Points System', 'Admin Dashboard', 'Standard Support'].map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-500">
                         <CheckCircle className="w-4 h-4 mr-3 text-gray-400" />
                         {item}
                      </li>
                   ))}
                </ul>
             </div>
             <div className="p-8 bg-purple-50/30">
                <h3 className="font-bold text-purple-900 mb-6 flex items-center text-lg">
                   VistaDeck <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded uppercase">Premium</span>
                </h3>
                <ul className="space-y-4">
                   {[
                      'WhatsApp Auto-Ordering Bot', 
                      'CRM & Lead Capture', 
                      'Abandoned Cart Recovery', 
                      'Priority 24/7 Support',
                      'Inventory Sync'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-sm font-bold text-gray-700">
                         <div className="p-0.5 bg-purple-600 rounded-full mr-3 text-white"><CheckCircle className="w-3 h-3" /></div>
                         {item}
                      </li>
                   ))}
                </ul>
                <a 
                   href="https://wa.me/919923993301?text=Upgrade%20to%20VistaDeck" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="mt-8 w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center justify-center hover:bg-black transition-colors"
                >
                   Contact Sales <ArrowRight className="w-4 h-4 ml-2" />
                </a>
             </div>
          </div>
      </div>
    </div>
  );
};
