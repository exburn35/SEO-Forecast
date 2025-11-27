export interface KeywordRow {
  id: string;
  keyword: string;
  searchVolume: number;
  currentPosition: number;
  targetPosition: number;
  cpc: number;
  keywordDifficulty: number;
}

export interface CalculatedMetrics {
  isBrand: boolean;
  probability: number;
  currentTraffic: number;
  potentialTraffic: number;
  weightedUplift: number;
  forecastTraffic: number;
  trafficValue: number; // Ad Spend Equivalent
  forecastRevenue: number;
}

export type KeywordRowWithMetrics = KeywordRow & CalculatedMetrics;

export interface CtrCurve {
  [key: number]: number;
}

export type RampUpModel = 'linear' | 'exponential';

export interface AppConfig {
  ctrCurve: CtrCurve;
  seasonality: number; // multiplier
  conversionRate: number; // percentage 0-100
  averageOrderValue: number;
  brandTerms: string[];
  forecastHorizon: number; // months, default 12
  rampUpModel: RampUpModel;
}

export interface MonthlyForecastData {
  month: number;
  brandTraffic: number;
  nonBrandBaseTraffic: number;
  nonBrandUpliftTraffic: number;
  totalTraffic: number;
  totalRevenue: number;
}
