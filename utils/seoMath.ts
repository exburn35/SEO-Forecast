import { AppConfig, CtrCurve, KeywordRow, KeywordRowWithMetrics, MonthlyForecastData } from '../types';

export const getCtr = (position: number, curve: CtrCurve): number => {
  if (position <= 0 || position > 20) return 0;
  if (position > 10) return 0; // Strict top 10 curve model
  return (curve[position] || 0) / 100;
};

export const getProbabilityFromKD = (kd: number): number => {
  if (kd < 30) return 0.80; // High probability for easy keywords
  if (kd < 70) return 0.50; // Medium probability
  return 0.30; // Low probability for hard keywords
};

export const isBrandKeyword = (keyword: string, brandTerms: string[]): boolean => {
  if (!brandTerms.length || (brandTerms.length === 1 && brandTerms[0] === '')) return false;
  const lowerKw = keyword.toLowerCase();
  return brandTerms.some(term => term.trim() && lowerKw.includes(term.toLowerCase().trim()));
};

export const calculateRowMetrics = (row: KeywordRow, config: AppConfig): KeywordRowWithMetrics => {
  const currentCtr = getCtr(row.currentPosition, config.ctrCurve);
  const targetCtr = getCtr(row.targetPosition, config.ctrCurve);
  const isBrand = isBrandKeyword(row.keyword, config.brandTerms);
  
  // Determine Probability
  const probability = getProbabilityFromKD(row.keywordDifficulty);

  // Core Traffic Calcs
  const currentTraffic = row.searchVolume * currentCtr;
  
  // Potential Traffic = Volume * Target CTR * Seasonality
  // Note: Seasonality is usually applied temporally, but here we apply as a general volume adjustment for the forecast basis
  const potentialTraffic = row.searchVolume * targetCtr * config.seasonality;
  
  // Uplift Logic
  // Uplift = (Potential - Current) * Probability
  // If potential is lower than current (e.g. target rank is worse), we allow negative uplift
  let rawUplift = potentialTraffic - currentTraffic;
  
  // If raw uplift is negative (dropping rank), we assume 100% probability of that happening usually, 
  // but for this model, let's apply probability only to GAINS. Losses are usually not "targeted".
  // Assuming target is always an improvement or maintenance in this tool's context.
  if (rawUplift < 0) rawUplift = 0; 

  const weightedUplift = rawUplift * probability;
  const forecastTraffic = currentTraffic + weightedUplift;

  // Financials
  // Ad Spend Equivalent (Value) = Traffic * CPC
  const trafficValue = forecastTraffic * row.cpc;
  
  // Revenue = Traffic * CVR * AOV
  const cvrDecimal = config.conversionRate / 100;
  const forecastRevenue = forecastTraffic * cvrDecimal * config.averageOrderValue;

  return {
    ...row,
    isBrand,
    probability,
    currentTraffic,
    potentialTraffic,
    weightedUplift,
    forecastTraffic,
    trafficValue,
    forecastRevenue
  };
};

export const generateMonthlyForecast = (
  rows: KeywordRowWithMetrics[], 
  config: AppConfig
): MonthlyForecastData[] => {
  const months = Array.from({ length: config.forecastHorizon }, (_, i) => i + 1);
  
  return months.map(month => {
    let brandTraffic = 0;
    let nonBrandBaseTraffic = 0;
    let nonBrandUpliftTraffic = 0;
    let totalRevenue = 0;

    // Ramp up factor (0 to 1 over the horizon)
    let rampFactor = 0;
    const t = month / config.forecastHorizon;
    
    if (config.rampUpModel === 'linear') {
      rampFactor = t;
    } else {
      // Exponential (Quadratic Ease-In)
      rampFactor = t * t;
    }

    rows.forEach(row => {
      // Current traffic is assumed constant baseline (or could apply seasonality monthly)
      // Uplift ramps up over time
      const monthlyUplift = row.weightedUplift * rampFactor;
      const monthlyTotal = row.currentTraffic + monthlyUplift;
      
      // Revenue for this month
      const cvrDecimal = config.conversionRate / 100;
      const monthlyRevenue = monthlyTotal * cvrDecimal * config.averageOrderValue;
      totalRevenue += monthlyRevenue;

      if (row.isBrand) {
        brandTraffic += monthlyTotal;
      } else {
        nonBrandBaseTraffic += row.currentTraffic;
        nonBrandUpliftTraffic += monthlyUplift;
      }
    });

    return {
      month,
      brandTraffic,
      nonBrandBaseTraffic,
      nonBrandUpliftTraffic,
      totalTraffic: brandTraffic + nonBrandBaseTraffic + nonBrandUpliftTraffic,
      totalRevenue
    };
  });
};

export const parseCSV = (text: string): KeywordRow[] => {
  const lines = text.split('\n');
  const result: KeywordRow[] = [];
  const startIndex = lines[0].toLowerCase().includes('keyword') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV split (comma)
    const cols = line.split(',').map(c => c.trim());
    if (cols.length < 2) continue;

    const keyword = cols[0];
    const searchVolume = parseFloat(cols[1]) || 0;
    const currentPosition = parseFloat(cols[2]) || 0;
    const targetPosition = parseFloat(cols[3]) || 3;
    
    // New fields: KD, CPC
    // Try to find them or default
    // Expected: Keyword, Vol, Cur, Tar, KD, CPC
    const kd = cols[4] ? parseFloat(cols[4]) : 50;
    const cpc = cols[5] ? parseFloat(cols[5]) : 0;

    result.push({
      id: `row-${i}-${Date.now()}`,
      keyword,
      searchVolume,
      currentPosition,
      targetPosition,
      keywordDifficulty: isNaN(kd) ? 50 : kd,
      cpc: isNaN(cpc) ? 0 : cpc
    });
  }
  return result;
};
