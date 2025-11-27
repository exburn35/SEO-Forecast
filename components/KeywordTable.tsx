import React from 'react';
import { KeywordRowWithMetrics } from '../types';
import { ArrowUpRight, Edit2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface KeywordTableProps {
  data: KeywordRowWithMetrics[];
  onUpdateTarget: (id: string, newTarget: number) => void;
}

export const KeywordTable: React.FC<KeywordTableProps> = ({ data, onUpdateTarget }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-800">Forecast Data Detail</h3>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Non-Brand
          </span>
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div> Brand
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 border-b border-gray-100">Keyword</th>
              <th className="px-6 py-3 border-b border-gray-100 text-right">Volume</th>
              <th className="px-6 py-3 border-b border-gray-100 text-center">Diff (KD)</th>
              <th className="px-6 py-3 border-b border-gray-100 text-center">Current</th>
              <th className="px-6 py-3 border-b border-gray-100 text-center w-24">Target</th>
              <th className="px-6 py-3 border-b border-gray-100 text-center">Prob %</th>
              <th className="px-6 py-3 border-b border-gray-100 text-right">Uplift</th>
              <th className="px-6 py-3 border-b border-gray-100 text-right">Rev/Mo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className={clsx("hover:bg-blue-50/30 transition-colors group", row.isBrand ? "bg-gray-50/30" : "")}>
                <td className="px-6 py-3 text-sm font-medium text-gray-800 max-w-xs truncate relative">
                  {row.keyword}
                  {row.isBrand && <span className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-gray-300" title="Brand Keyword"></span>}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 text-right font-mono">
                  {row.searchVolume.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-sm text-center">
                   <span className={clsx(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold",
                    row.keywordDifficulty < 30 ? "bg-green-100 text-green-700" :
                    row.keywordDifficulty < 70 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {row.keywordDifficulty}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 text-center">
                    {row.currentPosition > 0 ? row.currentPosition : '-'}
                </td>
                <td className="px-6 py-3 text-sm text-center">
                  <div className="flex items-center justify-center gap-1 group/input">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={row.targetPosition}
                      onChange={(e) => onUpdateTarget(row.id, parseInt(e.target.value))}
                      className="w-10 text-center border-b border-gray-300 focus:border-indigo-500 outline-none bg-transparent font-semibold text-indigo-700 py-1"
                    />
                    <Edit2 size={10} className="text-gray-300 group-hover/input:text-indigo-400 opacity-0 group-hover/input:opacity-100 transition-opacity" />
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 text-center font-mono text-xs">
                  {(row.probability * 100).toFixed(0)}%
                </td>
                <td className="px-6 py-3 text-sm text-right font-mono">
                  <div className="flex items-center justify-end gap-1">
                    <span className={clsx(
                      "font-bold",
                      row.weightedUplift > 0 ? "text-green-600" : "text-gray-400"
                    )}>
                      {row.weightedUplift > 0 ? '+' : ''}{Math.round(row.weightedUplift).toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-right font-mono font-medium text-gray-700">
                  ${Math.round(row.forecastRevenue).toLocaleString()}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
               <tr>
                 <td colSpan={8} className="px-6 py-12 text-center text-gray-400 italic">
                   No data available. Upload a CSV or check filter settings.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
