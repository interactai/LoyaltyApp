
import React, { useState, useEffect, memo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line, Bar
} from 'recharts';
import { 
  Users, Award, Printer, Clock, AlertTriangle, Megaphone, 
  CheckCircle, FileText, Plus, ArrowRight, TrendingUp, QrCode, 
  ChevronRight, Wallet, Store, Zap, Target, ArrowUpRight, ShieldCheck,
  TrendingDown, Info, MapPin, Search
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useLanguage } from '../contexts/LanguageContext';
import { User, ViewState } from '../types';
import { CardSkeleton, ChartSkeleton } from './common/Skeleton';

// Enhanced Activity Data
const DAILY_TREND_DATA = [
  { name: '08:00', scans: 12, rewards: 8 },
  { name: '10:00', scans: 45, rewards: 38 },
  { name: '12:00', scans: 78, rewards: 70 },
  { name: '14:00', scans: 92, rewards: 85 },
  { name: '16:00', scans: 110, rewards: 95 },
  { name: '18:00', scans: 85, rewards: 80 },
  { name: '20:00', scans: 40, rewards: 35 },
];

const FUNNEL_DATA = [
  { name: 'Issued', value: 1000, fill: '#f1f5f9' },
  { name: 'Scanned', value: 680, fill: '#fb923c' },
  { name: 'Rewarded', value: 450, fill: '#ea580c' },
];

const STORE_LOCATION_DATA = [
  { name: 'Kalyan West', value: 45 },
  { name: 'Ulhasnagar', value: 25 },
  { name: 'Dombivli', value: 20 },
  { name: 'Bhiwandi', value: 10 },
];

const TOP_RETAILERS = [
  { name: 'Ravi Hardware', scans: 142, points: 12400, lastActive: '2h ago' },
  { name: 'Sai Paint Mart', scans: 98, points: 8250, lastActive: '5h ago' },
  { name: 'Modern Interiors', scans: 85, points: 7100, lastActive: '1d ago' },
  { name: 'Deepak Electricals', scans: 64, points: 5200, lastActive: '2d ago' },
];

const PIE_COLORS = ['#ea580c', '#fb923c', '#fdba74', '#fed7aa'];

interface DashboardHomeProps {
  user?: User;
  onChangeView?: (view: ViewState) => void;
}

const DashboardHomeComponent: React.FC<DashboardHomeProps> = ({ user, onChangeView }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const isStoreAdmin = user?.role === 'STORE_ADMIN';

  useEffect(() => {
    // Simulate data loading to allow skeletons to show briefly, preventing layout shift
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (view: ViewState) => {
    if (onChangeView) onChangeView(view);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (isStoreAdmin) {
    return (
      <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
        {/* Hero Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t.storePerformance}</p>
                            <h2 className="text-4xl font-bold flex items-baseline gap-2">
                                12,500 <span className="text-sm font-normal text-gray-400">Points Awarded</span>
                            </h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="flex items-center text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> +14.2%
                            </span>
                            <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold">vs Last Week</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{t.activeCoupons}</p>
                            <p className="text-xl font-bold">142</p>
                            <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-orange-500 w-[68%]"></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{t.billsPending}</p>
                            <p className="text-xl font-bold text-orange-400">3</p>
                            <p className="text-[9px] text-gray-500 mt-1">Avg 2hr Approval</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Active Scanners</p>
                            <p className="text-xl font-bold text-blue-400">28</p>
                            <p className="text-[9px] text-gray-500 mt-1">Currently Online</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Retention</p>
                            <p className="text-xl font-bold text-green-400">92%</p>
                            <p className="text-[9px] text-gray-500 mt-1">Loyal Retailers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Insights / Recommendations */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-orange-600" />
                    {t.smartInsights}
                </h3>
                <div className="space-y-3">
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-orange-900 dark:text-orange-200">{t.inventoryHealth}</p>
                            <p className="text-[10px] text-orange-700 dark:text-orange-400 mt-0.5">{t.lowStockWarning}</p>
                        </div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                        <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-blue-900 dark:text-blue-200">{t.atRiskPartners}</p>
                            <p className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">3 partners haven't scanned in 10 days. Send a nudge.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Visual Activity Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t.dailyActivity}</h3>
                    <div className="flex gap-2">
                        <span className="flex items-center text-[10px] font-bold text-gray-400">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mr-1.5"></div> Scans
                        </span>
                        <span className="flex items-center text-[10px] font-bold text-gray-400">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div> Verified
                        </span>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={DAILY_TREND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                            <Tooltip 
                                cursor={{fill: 'rgba(0,0,0,0.02)'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#fff'}}
                            />
                            <Bar dataKey="scans" fill="#fb923c" radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="rewards" stroke="#3b82f6" strokeWidth={3} dot={{r: 3, fill: '#3b82f6'}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">{t.loyaltyFunnel}</h3>
                <div className="flex items-center justify-center">
                    <div className="flex-1 max-w-[280px]">
                        <div className="space-y-6">
                            {FUNNEL_DATA.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.name}</span>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{item.value}</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-1000" 
                                            style={{ width: `${(item.value / FUNNEL_DATA[0].value) * 100}%`, backgroundColor: item.fill }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="ml-12 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-orange-500 border-t-transparent flex items-center justify-center relative">
                            <div className="absolute inset-0 border-4 border-gray-100 dark:border-gray-800 rounded-full"></div>
                            <span className="text-lg font-bold text-orange-600 dark:text-orange-500">45%</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{t.conversionRate}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
                onClick={() => navigateTo(ViewState.GIFT_CARDS)}
                className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:border-orange-200 dark:hover:border-orange-900 transition-all active:scale-95 group"
            >
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-500 transition-transform group-hover:scale-110">
                    <QrCode className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px] uppercase tracking-wider">{t.giftCards}</span>
            </button>
            <button 
                onClick={() => navigateTo(ViewState.INVOICE_APPROVALS)}
                className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:border-blue-200 dark:hover:border-blue-900 transition-all active:scale-95 group"
            >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 transition-transform group-hover:scale-110">
                    <FileText className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px] uppercase tracking-wider">Verify Bills</span>
            </button>
            <button 
                onClick={() => navigateTo(ViewState.CUSTOMERS)}
                className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:border-green-200 dark:hover:border-green-900 transition-all active:scale-95 group"
            >
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-500 transition-transform group-hover:scale-110">
                    <Users className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px] uppercase tracking-wider">Members</span>
            </button>
            <button 
                onClick={() => navigateTo(ViewState.ANALYTICS)}
                className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:border-purple-200 dark:hover:border-purple-900 transition-all active:scale-95 group"
            >
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-500 transition-transform group-hover:scale-110">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px] uppercase tracking-wider">Reports</span>
            </button>
        </div>
      </div>
    );
  }

  // DEFAULT SUPER ADMIN VIEW
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Network Performance Insights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard 
          title={t.totalMembers}
          value="1,248" 
          change="+12% WoW" 
          isPositive={true} 
          icon={Users} 
          helpText="Total across all registered stores."
        />
        <StatsCard 
          title={t.pointsIssued}
          value="450k" 
          change="+₹5.2k Daily" 
          isPositive={true} 
          icon={Award} 
          helpText="Total points liability in circulation."
        />
        <StatsCard 
            title="Redemption Health"
            value="74.2%" 
            change="Strong" 
            isPositive={true} 
            icon={ShieldCheck} 
            helpText="Ratio of points earned to points redeemed."
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Action Center */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-orange-600" />
                    Action Center
                </h3>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-orange-600 dark:bg-orange-700 text-white flex items-center justify-center text-lg font-bold mr-3 shadow-md shadow-orange-200 dark:shadow-none">5</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Approvals Pending</p>
                                <p className="text-[10px] text-orange-700 dark:text-orange-400">Needs manual review</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-orange-400 dark:text-orange-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-black text-white flex items-center justify-center text-lg font-bold mr-3">12</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">New Stores</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Waitlisted for approval</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                    </div>
                </div>
            </div>

            {/* Growth Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t.performanceTrend}</h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold">Total Network Scans vs Verification</p>
                    </div>
                    <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-400 rounded-lg px-3 py-1.5 cursor-pointer outline-none">
                        <option>{t.last7Days}</option>
                        <option>{t.last30Days}</option>
                    </select>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DAILY_TREND_DATA}>
                            <defs>
                                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                                width={35}
                            />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="scans" 
                                stroke="#ea580c" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorScans)" 
                                activeDot={{r: 6, fill: '#ea580c'}}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};

export const DashboardHome = memo(DashboardHomeComponent);
