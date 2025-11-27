import React from 'react';
import { KeywordRowWithMetrics, MonthlyForecastData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  Area, AreaChart
} from 'recharts';
import { TrendingUp, DollarSign, MousePointer2, Layers } from 'lucide-react';

interface MetricsDashboardProps {
  data: KeywordRowWithMetrics[];
  monthlyData: MonthlyForecastData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload[0].value + payload[1].value + (payload[2]?.value || 0);
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-lg min-w-[200px]">
        <p className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">Month {label}</p>
        <div className="space-y-1.5">
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                <span className="text-gray-600 font-medium">{p.name}</span>
              </div>
              <span className="font-bold text-gray-800">{p.value >= 1000 ? `${(p.value/1000).toFixed(1)}k` : Math.round(p.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ data, monthlyData }) => {
  // Aggregates
  const nonBrandData = data.filter(d => !d.isBrand);
  
  const totalCurrentTraffic = data.reduce((sum, row) => sum + row.currentTraffic, 0);
  const totalForecastTraffic = data.reduce((sum, row) => sum + row.forecastTraffic, 0);
  const totalUplift = totalForecastTraffic - totalCurrentTraffic;
  
  const nonBrandUplift = nonBrandData.reduce((sum, row) => sum + row.weightedUplift, 0);
  
  const totalRevenue = data.reduce((sum, row) => sum + row.forecastRevenue, 0);
  
  const totalAdValue = data.reduce((sum, row) => sum + row.trafficValue, 0);

  // Waterfall Data
  const waterfallData = [
    { name: 'Current', value: Math.round(totalCurrentTraffic), type: 'base' },
    { name: 'Brand Uplift', value: Math.round(totalUplift - nonBrandUplift), type: 'brand' },
    { name: 'Non-Brand Uplift', value: Math.round(nonBrandUplift), type: 'nonbrand' },
    { name: 'Forecast Total', value: Math.round(totalForecastTraffic), type: 'total' }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-indigo-300 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <DollarSign size={40} className="text-indigo-600" />
          </div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2 z-10">
            <DollarSign size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Forecast Revenue (12m)</span>
          </div>
          <span className="text-2xl font-extrabold text-gray-900 z-10 tracking-tight">${Math.round(monthlyData.reduce((acc, m) => acc + m.totalRevenue, 0)).toLocaleString()}</span>
          <span className="text-xs text-gray-500 mt-1 font-medium z-10">Cumulative over 12 months</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-green-300 transition-colors">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp size={40} className="text-green-600" />
          </div>
          <div className="flex items-center gap-2 text-green-600 mb-2 z-10">
            <TrendingUp size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Non-Brand Uplift</span>
          </div>
          <div className="flex items-end gap-2 z-10">
            <span className="text-2xl font-extrabold text-green-600 tracking-tight">+{Math.round(nonBrandUplift).toLocaleString()}</span>
            <span className="text-sm font-medium text-green-500 mb-1">visits/mo</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 font-medium z-10">Weighted by Difficulty</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-blue-300 transition-colors">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <MousePointer2 size={40} className="text-blue-600" />
          </div>
          <div className="flex items-center gap-2 text-blue-600 mb-2 z-10">
            <MousePointer2 size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Traffic (M12)</span>
          </div>
          <span className="text-2xl font-extrabold text-blue-600 z-10 tracking-tight">{Math.round(totalForecastTraffic).toLocaleString()}</span>
          <span className="text-xs text-blue-400 mt-1 font-medium z-10">Month 12 Run Rate</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-orange-300 transition-colors">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Layers size={40} className="text-orange-600" />
          </div>
           <div className="flex items-center gap-2 text-orange-600 mb-2 z-10">
            <Layers size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Ad Spend Equivalent</span>
          </div>
          <span className="text-2xl font-extrabold text-orange-600 z-10 tracking-tight">${Math.round(totalAdValue).toLocaleString()}</span>
          <span className="text-xs text-gray-500 mt-1 font-medium z-10">Monthly Value (CPC)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 12-Month Forecast Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">12-Month Traffic Forecast</h3>
              <p className="text-xs text-gray-500 mt-1">Cumulative growth segmentation.</p>
            </div>
            <div className="flex gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 opacity-50"></div>
                <span className="text-gray-500">Brand</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-300"></div>
                <span className="text-gray-500">NB Base</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-200"></div>
                <span className="text-gray-800">NB Uplift</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNonBrandUplift" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorNonBrandBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a5b4fc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(v) => `M${v}`} 
                  axisLine={false} 
                  tickLine={false} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                
                {/* Stacked Areas - Order determines visual layering */}
                <Area 
                  type="monotone" 
                  dataKey="brandTraffic" 
                  stackId="1" 
                  stroke="#94a3b8" 
                  strokeWidth={1}
                  fill="url(#colorBrand)" 
                  name="Brand Traffic" 
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="nonBrandBaseTraffic" 
                  stackId="1" 
                  stroke="#818cf8" 
                  strokeWidth={1}
                  fill="url(#colorNonBrandBase)" 
                  name="Non-Brand Baseline" 
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="nonBrandUpliftTraffic" 
                  stackId="1" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  fill="url(#colorNonBrandUplift)" 
                  name="Non-Brand Uplift" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Opportunity Waterfall */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Opportunity Bridge</h3>
            <p className="text-xs text-gray-500 mt-1">Traffic gain components.</p>
          </div>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={waterfallData}
                margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis 
                  tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} 
                  fontSize={11} 
                  stroke="#94a3b8" 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" barSize={40} radius={[4, 4, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.type === 'base' ? '#cbd5e1' : 
                        entry.type === 'total' ? '#1e293b' : 
                        entry.type === 'brand' ? '#94a3b8' : '#4f46e5'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between mt-4 px-2">
              {waterfallData.map((d, i) => (
                <div key={i} className="text-center">
                   <div className={`text-[10px] font-bold uppercase ${d.type === 'nonbrand' ? 'text-indigo-600' : 'text-gray-400'}`}>{d.name.split(' ')[0]}</div>
                   <div className="text-xs font-semibold text-gray-800">{d.value > 1000 ? `${(d.value/1000).toFixed(1)}k` : d.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};