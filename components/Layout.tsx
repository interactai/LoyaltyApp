
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ViewState, UserRole, User } from '../types';
import { BRAND_CONFIG } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages, Menu, LayoutDashboard, QrCode, FileCheck, Users, MoreHorizontal, PieChart } from 'lucide-react';
import { NotificationToast } from './NotificationToast';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut: () => void;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  user: User;
}

export const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  onChangeView, 
  onSignOut,
  children,
  title,
  subtitle,
  user
}) => {
  const { primaryColor } = BRAND_CONFIG;
  const { language, toggleLanguage } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const displayUser = user || BRAND_CONFIG.defaultUser;
  const userRole = (displayUser.role || 'SUPER_ADMIN') as UserRole;
  const isStoreAdmin = userRole === 'STORE_ADMIN';

  // Mobile Bottom Nav Items based on Role
  const getBottomNavItems = () => {
    if (isStoreAdmin) {
      return [
        { view: ViewState.DASHBOARD, label: 'Home', icon: LayoutDashboard },
        { view: ViewState.GIFT_CARDS, label: 'Coupons', icon: QrCode },
        { view: ViewState.INVOICE_APPROVALS, label: 'Bills', icon: FileCheck },
        { view: ViewState.CUSTOMERS, label: 'Members', icon: Users },
      ];
    }
    // Super Admin
    return [
      { view: ViewState.DASHBOARD, label: 'Home', icon: LayoutDashboard },
      { view: ViewState.STORES, label: 'Stores', icon: Users },
      { view: ViewState.ANALYTICS, label: 'Analytics', icon: PieChart },
    ];
  };

  const navItems = getBottomNavItems();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-base transition-colors duration-200">
      <NotificationToast />
      <Sidebar 
        currentView={currentView} 
        onChangeView={onChangeView} 
        onSignOut={onSignOut} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={userRole}
      />
      
      <main className="flex-1 lg:ml-0 min-w-0 p-4 sm:p-6 lg:p-10 transition-all duration-300 text-gray-900 dark:text-gray-100 pb-24 lg:pb-10">
        {/* Centered Container for better proportions on large screens */}
        <div className="max-w-7xl mx-auto w-full">
            {/* Dynamic Header Area - Hidden on mobile if viewing Dashboard (as it has its own header) */}
            <header className={`flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-6 ${currentView === ViewState.DASHBOARD ? 'hidden lg:flex' : 'flex'}`}>
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-500 hover:border-orange-200 shadow-sm transition-colors shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 font-light tracking-wide">{subtitle}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                {/* Language Toggle */}
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all shadow-sm group"
                  title="Toggle Language"
                >
                  <Languages className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-orange-500" />
                  <div className="flex text-[10px] font-bold tracking-wider">
                    <span className={`${language === 'en' ? 'text-orange-600 dark:text-orange-500' : 'text-gray-400 dark:text-gray-600'}`}>EN</span>
                    <span className="mx-1 text-gray-300 dark:text-gray-700">/</span>
                    <span className={`${language === 'hi' ? 'text-orange-600 dark:text-orange-500' : 'text-gray-400 dark:text-gray-600'}`}>HI</span>
                  </div>
                </button>

                <div className="pl-6 border-l border-gray-200 dark:border-gray-800 flex items-center gap-3 hidden sm:flex">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white font-serif">{displayUser.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest">{userRole === 'SUPER_ADMIN' ? 'Headquarters' : 'Studio'}</p>
                  </div>
                  <div className={`w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-500 font-serif font-bold text-lg border-2 border-orange-100 dark:border-orange-900/50 shadow-sm`}>
                    {displayUser.initials}
                  </div>
                </div>
              </div>
            </header>
            
            {/* Mobile Header for Dashboard only (Simple) */}
            {currentView === ViewState.DASHBOARD && (
                 <div className="lg:hidden flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold text-sm border-2 border-orange-100 dark:border-orange-900 shadow-sm`}>
                            {displayUser.initials}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 font-bold uppercase tracking-wider">Namaste,</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{displayUser.name.split(' ')[0]}</p>
                        </div>
                    </div>
                    <button 
                      onClick={toggleLanguage}
                      className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm"
                    >
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-500 uppercase">{language}</span>
                    </button>
                 </div>
            )}

            {/* Dynamic Content Injection */}
            <div className="animate-fade-in-up">
              {children}
            </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-50 lg:hidden px-4 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         {navItems.map((item) => (
             <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[60px] transition-all duration-200 ${currentView === item.view ? 'text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
             >
                 <item.icon className={`w-6 h-6 ${currentView === item.view ? 'fill-current' : ''}`} strokeWidth={currentView === item.view ? 2.5 : 2} />
                 <span className="text-[10px] font-bold mt-1">{item.label}</span>
             </button>
         ))}
         
         <button
            onClick={() => setIsSidebarOpen(true)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[60px] text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200`}
         >
             <MoreHorizontal className="w-6 h-6" />
             <span className="text-[10px] font-bold mt-1">Menu</span>
         </button>
      </div>
    </div>
  );
};
