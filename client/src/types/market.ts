import type { LucideIcon } from 'lucide-react'

export type MarketBias = 'Very Bearish' | 'Bearish' | 'Neutral' | 'Bullish' | 'Very Bullish'

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M'

export type MarketCategory = 'All Markets' | 'Equities' | 'Metals' | 'Currency' | 'Rates'

export type AssetFilter = 'All Assets' | 'Indices' | 'Metals' | 'FX Pairs' | 'Rate Curves'

export type IndicatorKey =
  | 'cot'
  | 'retailPos'
  | 'seasonality'
  | 'trend'
  | 'gdp'
  | 'mPMI'
  | 'sPMI'
  | 'retailSales'
  | 'inflation'
  | 'employmentChange'
  | 'unemploymentRate'
  | 'interestRate'

export type MarketAsset = {
  id: string
  asset: string
  assetClass: AssetFilter
  desk: MarketCategory
  bias: MarketBias
  score: number
  cot: number
  retailPos: number
  seasonality: number
  trend: number
  gdp: number
  mPMI: number
  sPMI: number
  retailSales: number
  inflation: number
  employmentChange: number
  unemploymentRate: number
  interestRate: number
  lastUpdated: string
}

export type NavItem = {
  label: string
  icon: LucideIcon
}

export type ScoreAsset = {
  id: string
  symbol: string
  name: string
  assetClass: 'FX' | 'Equity Index' | 'Metals' | 'Rates' | 'Crypto'
  region: string
}

export type DateRangeKey = '30D' | '90D' | '6M' | '1Y'

export type ScoreHistoryPoint = {
  timestamp: string
  score: number
  trend: number
  volatility: number
  regime: 'Risk-On' | 'Neutral' | 'Risk-Off'
}

export type ScoreSummary = {
  latestScore: number
  averageScore: number
  scoreDelta: number
  highScore: number
  lowScore: number
  trendDelta: number
}

export type StockIndexAsset = {
  id: string
  symbol: string
  name: string
  region: string
  currency: string
}

export type PreciousMetalAsset = {
  id: string
  symbol: string
  name: string
  unit: string
  quoteCurrency: string
}

export type BiasLevel = 'Very Bearish' | 'Bearish' | 'Neutral' | 'Bullish' | 'Very Bullish'

export type PositioningSnapshot = {
  institutionalLong: number
  institutionalShort: number
  retailLong: number
  retailShort: number
  weeklyLongChange: number
  weeklyShortChange: number
}

export type PutCallPoint = {
  date: string
  ratio: number
  trend: number
}

export type ScoreBreakdownRow = {
  indicator: string
  score: number
  delta: number
}

export type EconomicMetricRow = {
  metric: string
  actual: string
  forecast: string
  previous?: string
  change: number
  unit: string
}

export type SentimentBucket = {
  cohort: string
  bullish: number
  neutral: number
  bearish: number
}

export type SeasonalitySummary = {
  month: string
  averagePerformance: number
  hitRate: number
  multiYearWindow: string
  tone: 'Positive' | 'Neutral' | 'Negative'
  monthly: Array<{ month: string; performance: number }>
}

export type InterestRateSummary = {
  currentYield: number
  movingAverage: number
  difference: number
  curveTone: string
}

export type IndicesDashboardData = {
  asset: StockIndexAsset
  generatedAt: string
  marketBias: {
    level: BiasLevel
    score: number
    confidence: number
  }
  positioning: PositioningSnapshot
  putCallRatio: PutCallPoint[]
  scoreBreakdown: ScoreBreakdownRow[]
  economicMetrics: EconomicMetricRow[]
  sentiment: SentimentBucket[]
  seasonality: SeasonalitySummary
  interestRates: InterestRateSummary
}

export type PositioningImbalance = PositioningSnapshot & {
  netPositioning: number
  imbalanceScore: number
}

export type SeasonalPerformancePoint = {
  month: string
  performance: number
  probability: number
}

export type YieldMetricRow = {
  tenor: string
  currentYield: number
  movingAverage: number
  spread: number
  delta: number
}

export type MetalsDashboardData = {
  asset: PreciousMetalAsset
  generatedAt: string
  marketBias: {
    level: BiasLevel
    score: number
    confidence: number
    bullishShare: number
    bearishShare: number
  }
  positioning: PositioningImbalance
  scoreBreakdown: ScoreBreakdownRow[]
  economicMetrics: EconomicMetricRow[]
  seasonality: SeasonalitySummary & {
    curve: SeasonalPerformancePoint[]
  }
  yieldMetrics: {
    curveTone: string
    realYieldPressure: number
    dollarSensitivity: number
    rows: YieldMetricRow[]
    trend: Array<{ date: string; yield: number; realYield: number }>
  }
  sentiment: {
    retailLong: number
    retailShort: number
    contrarianSignal: string
    institutionalInterpretation: string
    cohorts: SentimentBucket[]
  }
}
