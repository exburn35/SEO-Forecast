import React from 'react';
import { AppConfig } from '../types';
import { Settings, TrendingUp, DollarSign, Briefcase, Calendar } from 'lucide-react';

interface SidebarProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ config, setConfig }) => {
  
  const handleCtrChange = (pos: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setConfig(prev => ({
        ...prev,
        ctrCurve: { ...prev.ctrCurve, [pos]: numValue }
      }));
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0 flex flex-col shadow-sm z-10">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <TrendingUp size={24} />
          <span className="font-bold text-xl tracking-tight">SEO Forecast</span>
        </div>
        <p className="text-xs text-gray-400 font-medium">Enterprise Revenue Model</p>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Business Value Inputs */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm border-b border-gray-100 pb-2">
            <DollarSign size={14} /> Business Assumptions
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Conversion Rate (CVR)</label>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{config.conversionRate}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                value={config.conversionRate}
                onChange={(e) => setConfig(prev => ({ ...prev, conversionRate: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Avg. Order Value (AOV)</label>
              </div>
              <div className="relative">
                <span className="absolute left-2 top-2 text-gray-500 text-xs">$</span>
                <input
                  type="number"
                  value={config.averageOrderValue}
                  onChange={(e) => setConfig(prev => ({ ...prev, averageOrderValue: parseFloat(e.target.value) }))}
                  className="w-full pl-5 pr-2 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded focus:border-indigo-500 outline-none shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Segmentation */}
        <div>
           <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm border-b border-gray-100 pb-2">
            <Briefcase size={14} /> Segmentation
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Brand Identifier(s)</label>
            <input
              type="text"
              placeholder="e.g. acme, mybrand"
              value={config.brandTerms.join(', ')}
              onChange={(e) => setConfig(prev => ({ ...prev, brandTerms: e.target.value.split(',').map(s => s.trim()) }))}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded focus:border-indigo-500 outline-none shadow-sm placeholder-gray-400"
            />
            <p className="text-[10px] text-gray-400 mt-1">Comma separated terms to tag Brand KWs.</p>
          </div>
        </div>

        {/* Forecast Settings */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm border-b border-gray-100 pb-2">
            <Calendar size={14} /> Model Dynamics
          </div>
          
          <div className="space-y-4">
             <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Seasonality</label>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{config.seasonality}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={config.seasonality}
                onChange={(e) => setConfig(prev => ({ ...prev, seasonality: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Ramp-up Model (Time-to-Impact)</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, rampUpModel: 'linear' }))}
                  className={`flex-1 py-2 text-xs border rounded-md font-medium transition-colors ${config.rampUpModel === 'linear' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Linear
                </button>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, rampUpModel: 'exponential' }))}
                  className={`flex-1 py-2 text-xs border rounded-md font-medium transition-colors ${config.rampUpModel === 'exponential' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Exponential
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTR Curve Section */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={14} className="text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">CTR Model (%)</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pos) => (
              <div key={pos} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200 shadow-sm hover:border-indigo-200 transition-colors">
                <span className="text-xs font-bold text-gray-500 w-6">#{pos}</span>
                <div className="flex items-center justify-end w-16">
                  <input
                    type="number"
                    value={config.ctrCurve[pos]}
                    onChange={(e) => handleCtrChange(pos, e.target.value)}
                    className="w-full text-right text-sm font-bold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-indigo-500 transition-colors"
                  />
                  <span className="text-xs text-gray-400 ml-0.5">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};