import { CtrCurve, KeywordRow } from './types';

export const DEFAULT_CTR_CURVE: CtrCurve = {
  1: 32,
  2: 15,
  3: 10,
  4: 7,
  5: 5,
  6: 4,
  7: 3,
  8: 2,
  9: 1.5,
  10: 1,
};

export const SAMPLE_DATA: KeywordRow[] = [
  { id: '1', keyword: 'enterprise seo platform', searchVolume: 2400, currentPosition: 8, targetPosition: 3, cpc: 12.50, keywordDifficulty: 65 },
  { id: '2', keyword: 'seo forecasting tool', searchVolume: 1500, currentPosition: 12, targetPosition: 3, cpc: 4.20, keywordDifficulty: 45 },
  { id: '3', keyword: 'acme analytics', searchVolume: 5500, currentPosition: 1, targetPosition: 1, cpc: 0.50, keywordDifficulty: 10 },
  { id: '4', keyword: 'marketing attribution software', searchVolume: 8000, currentPosition: 22, targetPosition: 5, cpc: 18.00, keywordDifficulty: 85 },
  { id: '5', keyword: 'acme login', searchVolume: 12000, currentPosition: 1, targetPosition: 1, cpc: 0.00, keywordDifficulty: 5 },
  { id: '6', keyword: 'python for seo', searchVolume: 3200, currentPosition: 5, targetPosition: 2, cpc: 2.50, keywordDifficulty: 40 },
  { id: '7', keyword: 'data visualization dashboard', searchVolume: 6000, currentPosition: 15, targetPosition: 4, cpc: 8.75, keywordDifficulty: 72 },
];
