
import React, { useState, Suspense, useEffect, useTransition } from 'react';
import { Layout } from './components/Layout';
import { LoginScreen } from './components/LoginScreen';
import { ViewState, User } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PWAProvider } from './contexts/PWAContext';
import { MemberDashboard } from './components/MemberDashboard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { AuthService, GiftCardService } from './services/backend';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy Load Components
const DashboardHome = React.lazy(() => import('./components/DashboardHome').then(module => ({ default: module.DashboardHome })));
const LoyaltySuite = React.lazy(() => import('./components/LoyaltySuite').then(module => ({ default: module.LoyaltySuite })));
const SettingsView = React.lazy(() => import('./components/SettingsView').then(module => ({ default: module.SettingsView })));
const MarketingManager = React.lazy(() => import('./components/MarketingManager').then(module => ({ default: module.MarketingManager })));
const StoreManagement = React.lazy(() => import('./components/StoreManagement').then(module => ({ default: module.StoreManagement })));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
const VistaDeckUpsell = React.lazy(() => import('./components/VistaDeckUpsell').then(module => ({ default: module.VistaDeckUpsell })));
const HelpSection = React.lazy(() => import('./components/HelpSection').then(module => ({ default: module.HelpSection })));
const PayoutManagementView = React.lazy(() => import('./components/PayoutManagementView').then(module => ({ default: module.PayoutManagementView })));

const SuspenseLoader = () => (
  <div className="flex items-center justify-center h-[50vh] w-full">
    <Loader2 className="w-8 h-8 text-orange-500 animate-spin opacity-50" />
  </div>
);

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();
  const { addNotification } = useNotification();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      localStorage.setItem('pendingCoupon', code);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const viewConfig: Partial<Record<ViewState, { title: string; subtitle: string }>> = {
    [ViewState.DASHBOARD]: { title: t.dashboardTitle, subtitle: t.dashboardSubtitle },
    [ViewState.ANALYTICS]: { title: t.analyticsTitle, subtitle: t.analyticsSubtitle },
    [ViewState.CUSTOMERS]: { title: "Member Database", subtitle: "Manage loyalty program members" },
    [ViewState.STORES]: { title: "Distributor Network", subtitle: "Manage registered store partners" },
    [ViewState.GIFT_CARDS]: { title: "Bulk Sticker Printing", subtitle: "Generate and print point voucher codes" },
    [ViewState.INVOICE_APPROVALS]: { title: "Invoice Requests", subtitle: "Approve customer invoices to award points" },
    [ViewState.MARKETING]: { title: "Marketing & Promotions", subtitle: "Manage upsell banners for partners" },
    [ViewState.SETTINGS]: { title: t.settingsTitle, subtitle: t.settingsSubtitle },
    [ViewState.VISTADECK_UPSELL]: { title: "VistaDeck CRM", subtitle: "Next-gen automation tools for your business." },
    [ViewState.PAYOUTS]: { title: "Payout Approvals", subtitle: "Verify and complete partner cash withdrawals" },
    [ViewState.HELP]: { title: t.helpTitle, subtitle: t.helpSubtitle },
  };

  const handleViewChange = (view: ViewState) => {
    startTransition(() => {
      setCurrentView(view);
    });
  };

  useEffect(() => {
    if (currentUser) {
       if (currentUser.role === 'MEMBER') {
         document.title = `Partner Dashboard | vistaloyalty`;
       } else {
         const pageTitle = viewConfig[currentView]?.title || 'Dashboard';
         document.title = `${pageTitle} | vistaloyalty Admin`;
       }
    }
  }, [currentView, currentUser, t]);

  const handleLogin = async (mobile: string, password: string): Promise<User | null> => {
    try {
      const user = await AuthService.login(mobile, password);
      if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
      }
      return null;
    } catch (e) {
      console.error("Login Error", e);
      return null;
    }
  };

  const handleRegister = async (userData: any): Promise<User | null> => {
      try {
          const user = await AuthService.register(userData);
          if (user) {
              setCurrentUser(user);
              localStorage.setItem('currentUser', JSON.stringify(user));
              return user;
          }
          return null;
      } catch (e) {
          console.error("Registration Error", e);
          throw e;
      }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView(ViewState.DASHBOARD);
  };

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setCurrentUser(parsedUser);
      }
    } catch (e) {
      localStorage.removeItem('currentUser');
    }
  }, []);

  if (!currentUser) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
        <PWAInstallPrompt />
      </>
    );
  }

  if (currentUser.role === 'MEMBER') {
      return (
        <>
          <MemberDashboard user={currentUser} onSignOut={handleLogout} />
          <PWAInstallPrompt />
        </>
      );
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <DashboardHome user={currentUser} onChangeView={handleViewChange} />;
      case ViewState.ANALYTICS: return <AnalyticsDashboard userRole={currentUser.role} onChangeView={handleViewChange} />;
      case ViewState.CUSTOMERS: return <LoyaltySuite mode="points" user={currentUser} />; 
      case ViewState.STORES: return <StoreManagement />;
      case ViewState.GIFT_CARDS: return <LoyaltySuite mode="giftcards" user={currentUser} />;
      case ViewState.INVOICE_APPROVALS: return <LoyaltySuite mode="invoices" user={currentUser} />;
      case ViewState.MARKETING: return <MarketingManager user={currentUser} />;
      case ViewState.SETTINGS: return <SettingsView onNavigate={handleViewChange} />;
      case ViewState.VISTADECK_UPSELL: return <VistaDeckUpsell />;
      case ViewState.PAYOUTS: return <PayoutManagementView />;
      case ViewState.HELP: return <HelpSection userRole={currentUser.role} />;
      default: return <DashboardHome user={currentUser} onChangeView={handleViewChange} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={handleViewChange}
      onSignOut={handleLogout}
      title={viewConfig[currentView]?.title || 'Admin Portal'}
      subtitle={viewConfig[currentView]?.subtitle || ''}
      user={currentUser}
    >
      <div className={isPending ? "opacity-50 transition-opacity duration-300" : "transition-opacity duration-300"}>
        <Suspense fallback={<SuspenseLoader />}>
          {renderContent()}
        </Suspense>
      </div>
      <PWAInstallPrompt />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PWAProvider>
        <LanguageProvider>
          <ThemeProvider>
            <SettingsProvider>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
            </SettingsProvider>
          </ThemeProvider>
        </LanguageProvider>
      </PWAProvider>
    </ErrorBoundary>
  );
};

export default App;
