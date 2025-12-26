
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, MapPin, Calendar, Users, Target, Award, Download, Filter, Store, Banknote
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { UserRole, ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const MONTHLY_DATA = [
  { month: 'Jan', redemptions: 120, customers: 45, points: 45000 },
  { month: 'Feb', redemptions: 150, customers: 52, points: 52000 },
  { month: 'Mar', redemptions: 200, customers: 61, points: 78000 },
  { month: 'Apr', redemptions: 180, customers: 58, points: 65000 },
  { month: 'May', redemptions: 220, customers: 75, points: 89000 },
  { month: 'Jun', redemptions: 250, customers: 85, points: 102000 },
];

const LOCATION_DATA = [
  { name: 'Mumbai', value: 35 },
  { name: 'Pune', value: 25 },
  { name: 'Nagpur', value: 20 },
  { name: 'Nashik', value: 15 },
  { name: 'Aurangabad', value: 5 },
];

const TOP_AGENTS = [
  { id: 'L105', name: 'Ramesh Carpenter', location: 'Mumbai', redemptions: 42, pointsEarned: 12500, status: 'Active' },
  { id: 'L108', name: 'Suresh Electric', location: 'Pune', redemptions: 38, pointsEarned: 11200, status: 'Active' },
  { id: 'L112', name: 'Vijay Plumbers', location: 'Nagpur', redemptions: 31, pointsEarned: 9800, status: 'Active' },
  { id: 'L102', name: 'Omkar Interiors', location: 'Nashik', redemptions: 25, pointsEarned: 7500, status: 'Inactive' },
  { id: 'L115', name: 'City Hardware', location: 'Aurangabad', redemptions: 18, pointsEarned: 5400, status: 'Active' },
];

const TOP_STORES = [
  { id: 'S1', name: 'Mumbai Electronics', location: 'Mumbai', revenue: 450000, activeCoupons: 120, status: 'Active' },
  { id: 'S2', name: 'Pune Hardware', location: 'Pune', revenue: 320000, activeCoupons: 85, status: 'Active' },
  { id: 'S3', name: 'Nagpur Decor', location: 'Nagpur', revenue: 210000, activeCoupons: 45, status: 'Active' },
  { id: 'S4', name: 'Nashik Traders', location: 'Nashik', revenue: 180000, activeCoupons: 30, status: 'Inactive' },
  { id: 'S5', name: 'Aurangabad Ply', location: 'Aurangabad', revenue: 150000, activeCoupons: 25, status: 'Active' },
];

const PIE_COLORS = ['#ea580c', '#fb923c', '#fdba74', '#fed7aa', '#e2e8f0'];

interface AnalyticsDashboardProps {
  userRole?: UserRole;
  onChangeView?: (view: ViewState) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userRole, onChangeView }) => {
  const [timeRange, setTimeRange] = useState('30_DAYS');
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Controls & Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <h2 className="text-lg font-bold text-gray-900 flex items-center">
            {t.analyticsOverview}
         </h2>
         <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex-1 sm:flex-none">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none w-full"
              >
                  <option value="7_DAYS">{t.last7Days}</option>
                  <option value="30_DAYS">{t.last30Days}</option>
                  <option value="THIS_MONTH">{t.thisMonth}</option>
              </select>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors shadow-lg active:scale-95">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t.exportReport}</span>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title={t.redemptionRate} 
            value="68%" 
            change="+5%" 
            isPositive={true} 
            icon={Target} 
            helpText={t.redemptionRateDesc}
          />
          <StatsCard 
            title={t.avgTicket} 
            value="₹4,200" 
            change="+12%" 
            isPositive={true} 
            icon={Banknote} 
            helpText={t.avgTicketDesc}
          />
          <StatsCard 
            title={t.activePartners} 
            value={isSuperAdmin ? "42" : "142"} 
            change="+8" 
            isPositive={true} 
            icon={isSuperAdmin ? Store : Users} 
            helpText={t.activePartnersDesc}
          />
          <StatsCard 
            title={t.totalPoints} 
            value="850k" 
            change="-2%" 
            isPositive={false} 
            icon={Award} 
            helpText={t.totalPointsDesc}
          />
      </div>

      {/* 2. Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-6">
                <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                {t.performanceTrend}
            </h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_DATA} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 600}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', fontSize: '12px'}}
                            cursor={{fill: '#f9fafb'}}
                        />
                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                        <Bar dataKey="redemptions" name={t.dailyActivity} fill="#ea580c" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="customers" name={t.activePartners} fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Location Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-6">
                <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                {t.locationStats}
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center h-72">
                <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={LOCATION_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {LOCATION_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend 
                                layout="vertical" 
                                verticalAlign="middle" 
                                align="right"
                                wrapperStyle={{fontSize: '12px', fontWeight: 600}} 
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>

      {/* 3. Top Performers List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  {t.topPerformers}
              </h3>
              <select className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-2 py-1 cursor-pointer outline-none">
                <option>By Revenue</option>
                <option>By Points</option>
              </select>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <th className="pb-3 pl-2">Rank</th>
                          <th className="pb-3">{isSuperAdmin ? t.partnerName : t.member}</th>
                          <th className="pb-3">{t.status}</th>
                          <th className="pb-3 text-right">{t.pointsEarned}</th>
                          <th className="pb-3 text-right">{t.revenue}</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {isSuperAdmin ? (
                        TOP_STORES.map((store, i) => (
                          <tr key={store.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 pl-2">
                                  <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${i===0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {i + 1}
                                  </div>
                              </td>
                              <td className="py-3">
                                  <p className="text-sm font-bold text-gray-900">{store.name}</p>
                                  <p className="text-xs text-gray-400">{store.location}</p>
                              </td>
                              <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${store.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                      {store.status === 'Active' ? t.active : t.expired}
                                  </span>
                              </td>
                              <td className="py-3 text-right text-sm font-medium text-gray-600">
                                  {store.activeCoupons}
                              </td>
                              <td className="py-3 text-right">
                                  <span className="text-sm font-bold text-green-600">₹{(store.revenue/1000).toFixed(1)}k</span>
                              </td>
                          </tr>
                        ))
                      ) : (
                        TOP_AGENTS.map((agent, i) => (
                          <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 pl-2">
                                  <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${i===0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {i + 1}
                                  </div>
                              </td>
                              <td className="py-3">
                                  <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                                  <p className="text-xs text-gray-400">{agent.location}</p>
                              </td>
                              <td className="py-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-green-50 text-green-600 border-green-100">
                                      {t.active}
                                  </span>
                              </td>
                              <td className="py-3 text-right text-sm font-bold text-orange-600">
                                  {agent.pointsEarned.toLocaleString()}
                              </td>
                              <td className="py-3 text-right text-sm font-medium text-gray-500">
                                  -
                              </td>
                          </tr>
                        ))
                      )}
                  </tbody>
              </table>
          </div>
          <button 
              onClick={() => onChangeView && onChangeView(isSuperAdmin ? ViewState.STORES : ViewState.CUSTOMERS)}
              className="mt-4 w-full py-3 text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
              {t.viewAll}
          </button>
      </div>
    </div>
  );
};
