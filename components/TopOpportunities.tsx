import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { KeywordRowWithMetrics } from '../types';
import { TrendingUp, ArrowRight, Target, Zap, Loader2, Trophy, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface TopOpportunitiesProps {
  data: KeywordRowWithMetrics[];
}

export const TopOpportunities: React.FC<TopOpportunitiesProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  // Filter top 5 by weighted uplift
  const topOpportunities = useMemo(() => {
    return [...data]
      .filter(r => r.weightedUplift > 0)
      .sort((a, b) => b.weightedUplift - a.weightedUplift)
      .slice(0, 5);
  }, [data]);

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct a specific prompt based on the actual data
      const dataContext = topOpportunities.map(item => 
        `- Keyword: "${item.keyword}" | Gap: Pos ${item.currentPosition} → ${item.targetPosition} | KD: ${item.keywordDifficulty}/100 | Type: ${item.isBrand ? 'Brand' : 'Non-Brand'}`
      ).join('\n');

      const prompt = `
        You are a Senior SEO Strategist. Analyze these Top 5 High-Growth Opportunities:
        ${dataContext}

        Provide a concise, tactical action plan.
        For each keyword (or clustered by strategy), specifically address:
        1. **The Gap Analysis**: How difficult is the move from Current Position to Target Position?
        2. **Difficulty (KD) Context**: Does the KD suggest a need for Content (low KD) or Authority/Backlinks (high KD)?
        3. **Actionable Tactics**: Give 3 specific bullet points on how to bridge these specific gaps.

        Return the response as clean HTML.
        Use <h4 class="font-bold text-indigo-900 mt-4 mb-2"> for headers.
        Use <ul class="list-disc pl-5 space-y-1 text-gray-700 text-sm mb-3"> for lists.
        Use <p class="text-sm text-gray-600 mb-2"> for paragraphs.
        Do not use markdown code blocks.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysis(response.text);
    } catch (error) {
      console.error("Error generating analysis:", error);
      setAnalysis('<p class="text-red-600">Unable to generate analysis. Please check your API key configuration.</p>');
    } finally {
      setLoading(false);
    }
  };

  if (topOpportunities.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-10">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Top 5 High-Growth Opportunities</h3>
            <p className="text-xs text-gray-500">Keywords with highest weighted traffic potential</p>
          </div>
        </div>
        {!analysis && (
          <button
            onClick={generateAnalysis}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70 shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
            {loading ? 'Analyzing...' : 'Generate Strategic Plan'}
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Visual Grid of Top 5 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {topOpportunities.map((item, idx) => (
            <div key={item.id} className="relative flex flex-col bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow hover:border-indigo-200 group">
              <div className="absolute top-3 right-3 text-[10px] font-bold text-gray-300 group-hover:text-indigo-300">#{idx + 1}</div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Keyword</div>
                <div className="text-sm font-bold text-gray-900 leading-tight h-10 line-clamp-2" title={item.keyword}>
                  {item.keyword}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span>Ranking Gap</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span>{item.currentPosition}</span>
                    <ArrowRight size={12} className="text-gray-400" />
                    <span className="text-indigo-600">{item.targetPosition}</span>
                  </div>
                </div>

                <div>
                   <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span>Difficulty</span>
                  </div>
                  <div className={clsx(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-bold",
                    item.keywordDifficulty > 60 ? "bg-red-50 text-red-700" :
                    item.keywordDifficulty > 30 ? "bg-yellow-50 text-yellow-700" :
                    "bg-green-50 text-green-700"
                  )}>
                    KD {item.keywordDifficulty}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-gray-50">
                <div className="text-[10px] text-gray-400">Proj. Uplift</div>
                <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                  <TrendingUp size={14} />
                  +{Math.round(item.weightedUplift).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis Section */}
        {analysis ? (
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={20} />
                <h4 className="font-bold text-gray-900">AI Strategic Analysis</h4>
              </div>
              <button 
                onClick={() => setAnalysis(null)}
                className="text-xs text-gray-500 hover:text-gray-800 underline"
              >
                Close Analysis
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: analysis }} />
          </div>
        ) : (
           <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-sm text-gray-500 font-medium">
                Ready to analyze. Click the button above to generate actionable insights for these keywords.
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                We will evaluate the specific effort required to move from the current rank to the target rank based on the provided KD scores.
              </p>
           </div>
        )}
      </div>
    </div>
  );
};