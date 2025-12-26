
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

  const sidebarClasses = 'bg-white text-gray-600 border-gray-200';
  
  const getNavItemClass = (view: ViewState) => {
    const isActive = currentView === view;
    const baseClass = "flex items-center w-full px-4 py-3 mb-1 text-sm font-bold transition-all duration-200 rounded-xl group";
    
    if (isActive) {
      return `${baseClass} bg-orange-50 text-orange-700 shadow-sm`;
    }
    return `${baseClass} text-gray-500 hover:bg-gray-50 hover:text-gray-900`;
  };

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 flex flex-col font-sans 
        transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-sm
        border-r ${sidebarClasses}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static
        print:hidden
      `}>
        <div className={`flex items-center h-20 px-6 shrink-0 border-b border-gray-100`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-orange-600 text-white rounded-lg shadow-md`}>
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">{appName}</span>
          </div>
          <button 
            onClick={onClose}
            className={`lg:hidden ml-auto p-1 rounded-md transition-colors text-gray-400 hover:text-gray-600`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          <div className="mb-8">
            <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">{t.overview}</p>
            <button onClick={() => handleNavClick(ViewState.DASHBOARD)} className={getNavItemClass(ViewState.DASHBOARD)}>
              <LayoutDashboard className={`w-5 h-5 mr-3 ${currentView === ViewState.DASHBOARD ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {t.dashboard}
            </button>
            
            {(userRole === 'STORE_ADMIN' || userRole === 'SUPER_ADMIN') && (
              <button onClick={() => handleNavClick(ViewState.ANALYTICS)} className={getNavItemClass(ViewState.ANALYTICS)}>
                <PieChart className={`w-5 h-5 mr-3 ${currentView === ViewState.ANALYTICS ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {t.analytics}
              </button>
            )}

            <button onClick={() => handleNavClick(ViewState.CUSTOMERS)} className={getNavItemClass(ViewState.CUSTOMERS)}>
              <Users className={`w-5 h-5 mr-3 ${currentView === ViewState.CUSTOMERS ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {t.pointsProgram}
            </button>
            
            {userRole === 'SUPER_ADMIN' && (
              <button onClick={() => handleNavClick(ViewState.STORES)} className={getNavItemClass(ViewState.STORES)}>
                <Store className={`w-5 h-5 mr-3 ${currentView === ViewState.STORES ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {t.stores}
              </button>
            )}
          </div>

          <div className="mb-8">
            <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">{t.loyaltySuite}</p>
            
            {(userRole === 'STORE_ADMIN' || userRole === 'SUPER_ADMIN') && (
              <button onClick={() => handleNavClick(ViewState.PAYOUTS)} className={getNavItemClass(ViewState.PAYOUTS)}>
                <Banknote className={`w-5 h-5 mr-3 ${currentView === ViewState.PAYOUTS ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                Payouts
              </button>
            )}

            {userRole === 'STORE_ADMIN' && (
              <>
                <button onClick={() => handleNavClick(ViewState.GIFT_CARDS)} className={getNavItemClass(ViewState.GIFT_CARDS)}>
                  <QrCode className={`w-5 h-5 mr-3 ${currentView === ViewState.GIFT_CARDS ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {t.giftCards}
                </button>

                <button onClick={() => handleNavClick(ViewState.INVOICE_APPROVALS)} className={getNavItemClass(ViewState.INVOICE_APPROVALS)}>
                  <FileCheck className={`w-5 h-5 mr-3 ${currentView === ViewState.INVOICE_APPROVALS ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {t.approveBills}
                </button>
              </>
            )}

            {userRole === 'SUPER_ADMIN' && (
              <button onClick={() => handleNavClick(ViewState.MARKETING)} className={getNavItemClass(ViewState.MARKETING)}>
                <Megaphone className={`w-5 h-5 mr-3 ${currentView === ViewState.MARKETING ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {t.marketing || 'Promotions'}
              </button>
            )}
          </div>

          {userRole === 'STORE_ADMIN' && (
            <div className="mb-8">
               <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">{t.growSales || "Grow Sales"}</p>
               <button 
                  onClick={() => handleNavClick(ViewState.VISTADECK_UPSELL)} 
                  className={`${getNavItemClass(ViewState.VISTADECK_UPSELL)} relative overflow-hidden`}
               >
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity ${currentView === ViewState.VISTADECK_UPSELL ? 'opacity-100' : 'group-hover:opacity-100'}`} />
                  <Rocket className={`w-5 h-5 mr-3 relative z-10 ${currentView === ViewState.VISTADECK_UPSELL ? 'text-purple-600' : 'text-purple-500'}`} />
                  <span className={`relative z-10 ${currentView === ViewState.VISTADECK_UPSELL ? 'text-purple-700' : 'text-gray-600 group-hover:text-purple-700'}`}>
                    {t.vistaDeck || "VistaDeck CRM"}
                  </span>
               </button>
            </div>
          )}

        </div>

        <div className={`p-4 border-t border-gray-100 shrink-0`}>
          {(userRole === 'SUPER_ADMIN' || userRole === 'STORE_ADMIN') && (
            <button 
              onClick={() => handleNavClick(ViewState.SETTINGS)}
              className={getNavItemClass(ViewState.SETTINGS)}
            >
              <Settings className={`w-5 h-5 mr-3 ${currentView === ViewState.SETTINGS ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {t.settings}
            </button>
          )}

          <button 
            onClick={() => handleNavClick(ViewState.HELP)}
            className={getNavItemClass(ViewState.HELP)}
          >
            <HelpCircle className={`w-5 h-5 mr-3 ${currentView === ViewState.HELP ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
            {t.help}
          </button>

          <div className="px-2 py-3">
             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                <div>
                   <p className="text-[11px] font-bold text-gray-900 leading-none">Online</p>
                   <p className="text-[10px] text-gray-400 mt-0.5 font-medium">B2B Edition v1.1</p>
                </div>
             </div>
          </div>

          <button 
            onClick={onSignOut}
            className="flex-1 flex items-center justify-center w-full px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
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
