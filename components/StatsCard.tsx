import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  helpText?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, isPositive, icon: Icon, helpText }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center">
             <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">{title}</p>
             {helpText && (
               <div className="group/tooltip relative ml-2 cursor-help">
                 <HelpCircle className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 hover:text-orange-500 transition-colors" />
                 <div className="invisible group-hover/tooltip:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-gray-900 text-white text-[10px] font-bold leading-relaxed rounded-xl shadow-xl z-50 text-center pointer-events-none">
                   {helpText}
                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900"></div>
                 </div>
               </div>
             )}
           </div>
           <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-colors">
              <Icon className="w-5 h-5 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors" />
           </div>
        </div>
        
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
          
          {change && (
            <div className="flex items-center gap-2 mt-2">
               <span className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${isPositive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                 {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                 {change}
               </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};