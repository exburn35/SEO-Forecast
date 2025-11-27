import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MetricsDashboard } from './components/MetricsDashboard';
import { KeywordTable } from './components/KeywordTable';
import { TopOpportunities } from './components/TopOpportunities';
import { AppConfig, KeywordRow } from './types';
import { DEFAULT_CTR_CURVE, SAMPLE_DATA } from './constants';
import { calculateRowMetrics, parseCSV, generateMonthlyForecast } from './utils/seoMath';
import { Upload, Zap, Download, FileSpreadsheet } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>({
    ctrCurve: DEFAULT_CTR_CURVE,
    seasonality: 1.0,
    conversionRate: 2.0, // Default 2%
    averageOrderValue: 150.0, // Default $150
    brandTerms: ['acme'], // Default brand
    forecastHorizon: 12,
    rampUpModel: 'linear'
  });

  const [rawRows, setRawRows] = useState<KeywordRow[]>(SAMPLE_DATA);

  // 1. Calculate per-row metrics (Probability, Uplift, etc.)
  const processedData = useMemo(() => {
    return rawRows.map(row => calculateRowMetrics(row, config));
  }, [rawRows, config]);

  // 2. Calculate 12-month timeline data
  const monthlyForecast = useMemo(() => {
    return generateMonthlyForecast(processedData, config);
  }, [processedData, config]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          setRawRows(parsed);
        } else {
          alert('Could not parse CSV. Required columns: Keyword, Search Volume, Current Position, Target Position, KD, CPC');
        }
      };
      reader.readAsText(file);
    }
  };

  const updateTargetPosition = (id: string, newTarget: number) => {
    setRawRows(prev => prev.map(row => 
      row.id === id ? { ...row, targetPosition: newTarget } : row
    ));
  };

  const handleDownloadCSV = () => {
    const headers = [
      'Keyword', 'Volume', 'Current Pos', 'Target Pos', 'KD', 'Type', 
      'Prob %', 'Est. Current Traffic', 'Target Uplift', 'Forecast Traffic', 'Forecast Revenue'
    ];
    
    const csvContent = [
      headers.join(','),
      ...processedData.map(row => [
        `"${row.keyword}"`,
        row.searchVolume,
        row.currentPosition,
        row.targetPosition,
        row.keywordDifficulty,
        row.isBrand ? 'Brand' : 'Non-Brand',
        (row.probability * 100).toFixed(0),
        row.currentTraffic.toFixed(2),
        row.weightedUplift.toFixed(2),
        row.forecastTraffic.toFixed(2),
        row.forecastRevenue.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'enterprise_seo_forecast.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar config={config} setConfig={setConfig} />

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Forecasting Intelligence</h1>
              <p className="text-sm text-gray-500">Bottom-up traffic & revenue modeling based on keyword difficulty.</p>
            </div>
            
            <div className="flex gap-3">
               <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium text-gray-700">
                <Upload size={16} />
                <span>Upload CSV</span>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>

              <button 
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm font-medium"
              >
                <Download size={16} />
                <span>Export Model</span>
              </button>
            </div>
          </div>

          <MetricsDashboard data={processedData} monthlyData={monthlyForecast} />

          <KeywordTable data={processedData} onUpdateTarget={updateTargetPosition} />
          
          <TopOpportunities data={processedData} />

          <div className="text-center text-xs text-gray-400 pb-4">
             Enterprise SEO Model v2.0 • Powered by Recharts & React
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
