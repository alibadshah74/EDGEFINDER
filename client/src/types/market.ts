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
