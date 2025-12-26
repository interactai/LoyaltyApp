import React, { useState, useEffect, memo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Bar
} from 'recharts';
import { 
  Users, Award, AlertTriangle, FileText, QrCode, 
  TrendingUp, Zap, Target, ArrowUpRight, ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useLanguage } from '../contexts/LanguageContext';
import { User, ViewState } from '../types';
import { CardSkeleton, ChartSkeleton } from './common/Skeleton';

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
  { name: 'ISSUED', value: 1000, fill: '#94a3b8' },
  { name: 'SCANNED', value: 680, fill: '#fb923c' },
  { name: 'REWARDED', value: 450, fill: '#ea580c' },
];

interface DashboardHomeProps {
  user?: User;
  onChangeView?: (view: ViewState) => void;
}

const DashboardHomeComponent: React.FC<DashboardHomeProps> = ({ user, onChangeView }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const isStoreAdmin = user?.role === 'STORE_ADMIN';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (view: ViewState) => {
    if (onChangeView) onChangeView(view);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (isStoreAdmin) {
    return (
      <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-1">{t.storePerformance}</p>
                            <h2 className="text-4xl font-bold tracking-tight">
                                12,500 <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">PTS</span>
                            </h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="flex items-center text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                                <ArrowUpRight className="w-4 h-4 mr-1" /> 14.2%
                            </span>
                            <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest">Growth</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 border-t border-white/10 pt-8">
                        <div><p className="text-[10px] text-gray-500 uppercase font-bold mb-1">QR CODES</p><p className="text-xl font-bold">142</p></div>
                        <div><p className="text-[10px] text-gray-500 uppercase font-bold mb-1">BILLS</p><p className="text-xl font-bold text-orange-500">3</p></div>
                        <div><p className="text-[10px] text-gray-500 uppercase font-bold mb-1">ACTIVE</p><p className="text-xl font-bold text-blue-500">28</p></div>
                        <div><p className="text-[10px] text-gray-500 uppercase font-bold mb-1">RETENTION</p><p className="text-xl font-bold text-green-500">92%</p></div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center">
                    <Zap className="w-5 h-5 mr-3 text-orange-600" />
                    NOTIFICATIONS
                </h3>
                <div className="space-y-3">
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/20 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-orange-900 dark:text-orange-200">{t.inventoryHealth}</p>
                            <p className="text-[10px] text-orange-700 dark:text-orange-400 mt-1 font-medium">Sticker stock is running low.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Soft rounded Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
                onClick={() => navigateTo(ViewState.GIFT_CARDS)}
                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:shadow-lg transition-all group active:scale-95 shadow-sm"
            >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <QrCode className="w-6 h-6" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">Generate QR</span>
            </button>
            <button 
                onClick={() => navigateTo(ViewState.INVOICE_APPROVALS)}
                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:shadow-lg transition-all group active:scale-95 shadow-sm"
            >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">Verify Bills</span>
            </button>
            <button 
                onClick={() => navigateTo(ViewState.CUSTOMERS)}
                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:shadow-lg transition-all group active:scale-95 shadow-sm"
            >
                <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">Members</span>
            </button>
            <button 
                onClick={() => navigateTo(ViewState.ANALYTICS)}
                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:shadow-lg transition-all group active:scale-95 shadow-sm"
            >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">Analytics</span>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">{t.dailyActivity}</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={DAILY_TREND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey="scans" fill="#fb923c" radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="rewards" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Loyalty Conversion Funnel</h3>
                <div className="space-y-6">
                    {FUNNEL_DATA.map((item, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.name}</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{item.value} Units</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${(item.value / FUNNEL_DATA[0].value) * 100}%`, backgroundColor: item.fill }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatsCard title={t.totalMembers} value="1,248" change="+12% WoW" isPositive={true} icon={Users} />
        <StatsCard title={t.pointsIssued} value="450K" change="+₹5.2K DAILY" isPositive={true} icon={Award} />
        <StatsCard title="REDEMPTION RATE" value="74.2%" change="STABLE" isPositive={true} icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">QUICK ACTIONS</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl hover:bg-orange-100 transition-colors cursor-pointer group">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center text-lg font-bold mr-4">5</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Approvals</p>
                                <p className="text-[10px] text-gray-500">Waitlisted</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-black text-white flex items-center justify-center text-lg font-bold mr-4">12</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">New Stores</p>
                                <p className="text-[10px] text-gray-500">Awaiting setup</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.performanceTrend}</h3>
                        <p className="text-[10px] text-gray-500 font-medium mt-1">Network-wide Scan Data</p>
                    </div>
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
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 600}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 600}} width={40} />
                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}} />
                            <Area type="monotone" dataKey="scans" stroke="#ea580c" strokeWidth={3} fill="url(#colorScans)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};

export const DashboardHome = memo(DashboardHomeComponent);