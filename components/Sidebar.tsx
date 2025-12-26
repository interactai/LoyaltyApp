import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  LogOut,
  X,
  QrCode,
  FileCheck,
  Megaphone,
  Store,
  PieChart,
  Rocket,
  HelpCircle,
  Banknote
} from 'lucide-react';
import { ViewState, UserRole } from '../types';
import { BRAND_CONFIG } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut: () => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

const SidebarComponent: React.FC<SidebarProps> = ({ currentView, onChangeView, onSignOut, isOpen, onClose, userRole }) => {
  const { appName, logoIcon: Logo } = BRAND_CONFIG;
  const { t } = useLanguage();

  const getNavItemClass = (view: ViewState) => {
    const isActive = currentView === view;
    const baseClass = "flex items-center w-full px-4 py-3 mb-1 text-sm font-semibold transition-all duration-200 rounded-xl group";
    
    if (isActive) {
      return `${baseClass} bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-500 shadow-sm`;
    }
    return `${baseClass} bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white`;
  };

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 flex flex-col font-sans 
        transition-transform duration-300 ease-in-out lg:static
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        print:hidden
      `}>
        <div className="flex items-center h-20 px-6 shrink-0 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 text-white rounded-xl shadow-md">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{appName}</span>
          </div>
          <button onClick={onClose} className="lg:hidden ml-auto p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          <div className="mb-8">
            <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">{t.overview}</p>
            <button onClick={() => handleNavClick(ViewState.DASHBOARD)} className={getNavItemClass(ViewState.DASHBOARD)}>
              <LayoutDashboard className="w-5 h-5 mr-3" />
              {t.dashboard}
            </button>
            
            {(userRole === 'STORE_ADMIN' || userRole === 'SUPER_ADMIN') && (
              <button onClick={() => handleNavClick(ViewState.ANALYTICS)} className={getNavItemClass(ViewState.ANALYTICS)}>
                <PieChart className="w-5 h-5 mr-3" />
                {t.analytics}
              </button>
            )}

            <button onClick={() => handleNavClick(ViewState.CUSTOMERS)} className={getNavItemClass(ViewState.CUSTOMERS)}>
              <Users className="w-5 h-5 mr-3" />
              {t.pointsProgram}
            </button>
            
            {userRole === 'SUPER_ADMIN' && (
              <button onClick={() => handleNavClick(ViewState.STORES)} className={getNavItemClass(ViewState.STORES)}>
                <Store className="w-5 h-5 mr-3" />
                {t.stores}
              </button>
            )}
          </div>

          <div className="mb-8">
            <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">{t.loyaltySuite}</p>
            
            {(userRole === 'STORE_ADMIN' || userRole === 'SUPER_ADMIN') && (
              <button onClick={() => handleNavClick(ViewState.PAYOUTS)} className={getNavItemClass(ViewState.PAYOUTS)}>
                <Banknote className="w-5 h-5 mr-3" />
                Payouts
              </button>
            )}

            {userRole === 'STORE_ADMIN' && (
              <>
                <button onClick={() => handleNavClick(ViewState.GIFT_CARDS)} className={getNavItemClass(ViewState.GIFT_CARDS)}>
                  <QrCode className="w-5 h-5 mr-3" />
                  {t.giftCards}
                </button>

                <button onClick={() => handleNavClick(ViewState.INVOICE_APPROVALS)} className={getNavItemClass(ViewState.INVOICE_APPROVALS)}>
                  <FileCheck className="w-5 h-5 mr-3" />
                  {t.approveBills}
                </button>
              </>
            )}

            {userRole === 'SUPER_ADMIN' && (
              <button onClick={() => handleNavClick(ViewState.MARKETING)} className={getNavItemClass(ViewState.MARKETING)}>
                <Megaphone className="w-5 h-5 mr-3" />
                Promotions
              </button>
            )}
          </div>

          {userRole === 'STORE_ADMIN' && (
            <div className="mb-8">
               <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">Growth</p>
               <button onClick={() => handleNavClick(ViewState.VISTADECK_UPSELL)} className={getNavItemClass(ViewState.VISTADECK_UPSELL)}>
                  <Rocket className="w-5 h-5 mr-3" />
                  VistaDeck CRM
               </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 shrink-0 space-y-2">
          <button onClick={() => handleNavClick(ViewState.SETTINGS)} className={getNavItemClass(ViewState.SETTINGS)}>
            <Settings className="w-5 h-5 mr-3" />
            {t.settings}
          </button>
          <button onClick={() => handleNavClick(ViewState.HELP)} className={getNavItemClass(ViewState.HELP)}>
            <HelpCircle className="w-5 h-5 mr-3" />
            {t.help}
          </button>

          <button 
            onClick={onSignOut}
            className="w-full mt-4 flex items-center justify-center px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t.signOut}
          </button>
        </div>
      </aside>
    </>
  );
};

export const Sidebar = React.memo(SidebarComponent);