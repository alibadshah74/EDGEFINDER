import type { IndicesDashboardData, StockIndexAsset } from '../types/market'

export const stockIndexAssets: StockIndexAsset[] = [
  { id: 'SPX-CORE', symbol: 'SPX500', name: 'US Large Cap Synthetic', region: 'United States', currency: 'USD' },
  { id: 'NDX-GROWTH', symbol: 'NAS100', name: 'US Growth Composite', region: 'United States', currency: 'USD' },
  { id: 'DAX-EUR', symbol: 'GER40', name: 'Europe Industrial Index', region: 'Euro Area', currency: 'EUR' },
  { id: 'NIK-APAC', symbol: 'JPN225', name: 'Japan Equity Complex', region: 'Japan', currency: 'JPY' },
  { id: 'FTSE-UK', symbol: 'UK100', name: 'UK Blue Chip Basket', region: 'United Kingdom', currency: 'GBP' },
]

const seedFrom = (value: string) => Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0)
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const round = (value: number, digits = 1) => Number(value.toFixed(digits))

function seededNoise(index: number, seed: number) {
  return Math.sin(index / 3.2 + seed * 0.11) * 0.08 + Math.cos(index / 7.4 + seed * 0.03) * 0.05
}

export function generateIndicesDashboard(symbolId = 'SPX-CORE'): IndicesDashboardData {
  const asset = stockIndexAssets.find((item) => item.id === symbolId) ?? stockIndexAssets[0]
  const seed = seedFrom(asset.id)
  const score = clamp(Math.round(54 + Math.sin(seed * 0.12) * 23 + (seed % 9)), 8, 94)
  const level = score >= 78 ? 'Very Bullish' : score >= 58 ? 'Bullish' : score >= 43 ? 'Neutral' : score >= 24 ? 'Bearish' : 'Very Bearish'
  const instLong = clamp(52 + Math.sin(seed) * 14 + (seed % 6), 28, 78)
  const retailLong = clamp(44 - Math.cos(seed) * 18 + (seed % 8), 18, 82)
  const today = new Date('2026-05-14T00:00:00.000Z')

  const putCallRatio = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - (41 - index))
    const ratio = clamp(0.92 + seededNoise(index, seed) + Math.sin(index / 5.5) * 0.13 + (seed % 5) * 0.018, 0.58, 1.42)
    const trend = clamp(0.94 + Math.sin(index / 8 + seed * 0.01) * 0.09 + (seed % 3) * 0.025, 0.62, 1.34)
    return { date: date.toISOString(), ratio: round(ratio, 2), trend: round(trend, 2) }
  })

  const scoreBreakdown = [
    ['Institutional Positioning', 2.4, 0.3],
    ['Retail Sentiment', -1.2, -0.4],
    ['Seasonality', 1.8, 0.6],
    ['Trend Reading', 2.1, 0.2],
    ['GDP', 0.9, 0.1],
    ['Manufacturing PMI', -0.8, -0.3],
    ['Services PMI', 1.2, 0.4],
    ['Retail Sales', -0.4, -0.2],
    ['Inflation', -1.6, 0.1],
    ['Employment Change', 0.7, -0.1],
    ['Unemployment Rate', 0.5, 0.2],
    ['Interest Rates', -0.9, -0.2],
  ].map(([indicator, base, delta], index) => ({
    indicator: String(indicator),
    score: round(Number(base) + Math.sin(seed * 0.05 + index) * 0.7, 1),
    delta: round(Number(delta) + Math.cos(seed * 0.08 + index) * 0.25, 1),
  }))

  const economicMetrics = [
    ['GDP Growth', '2.3%', '2.1%', 0.2, '%'],
    ['Manufacturing PMI', '49.8', '50.4', -0.6, 'pts'],
    ['Services PMI', '53.7', '52.8', 0.9, 'pts'],
    ['Retail Sales', '0.3%', '0.5%', -0.2, '%'],
    ['CPI', '2.9%', '3.0%', -0.1, '%'],
    ['Core CPI', '0.2%', '0.3%', -0.1, '%'],
    ['Employment Data', '178k', '165k', 13, 'k'],
    ['Unemployment Rate', '4.0%', '4.1%', -0.1, '%'],
  ].map(([metric, actual, forecast, change, unit]) => ({ metric: String(metric), actual: String(actual), forecast: String(forecast), change: Number(change), unit: String(unit) }))

  const monthly = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => ({
    month,
    performance: round(Math.sin(index * 0.9 + seed * 0.04) * 1.4 + Math.cos(index * 0.35) * 0.65, 2),
  }))

  return {
    asset,
    generatedAt: today.toISOString(),
    marketBias: { level, score, confidence: clamp(64 + (seed % 23), 58, 91) },
    positioning: {
      institutionalLong: round(instLong, 1),
      institutionalShort: round(100 - instLong, 1),
      retailLong: round(retailLong, 1),
      retailShort: round(100 - retailLong, 1),
      weeklyLongChange: round(Math.sin(seed) * 1.8, 1),
      weeklyShortChange: round(Math.cos(seed) * 1.6, 1),
    },
    putCallRatio,
    scoreBreakdown,
    economicMetrics,
    sentiment: [
      { cohort: 'Asset Managers', bullish: 47, neutral: 31, bearish: 22 },
      { cohort: 'Volatility Desks', bullish: 36, neutral: 29, bearish: 35 },
      { cohort: 'Systematic Funds', bullish: 58, neutral: 24, bearish: 18 },
      { cohort: 'Retail Flow', bullish: 28, neutral: 21, bearish: 51 },
    ],
    seasonality: {
      month: 'May',
      averagePerformance: monthly[4].performance,
      hitRate: 62 + (seed % 12),
      multiYearWindow: '10 year synthetic window',
      tone: monthly[4].performance > 0.35 ? 'Positive' : monthly[4].performance < -0.35 ? 'Negative' : 'Neutral',
      monthly,
    },
    interestRates: {
      currentYield: round(3.82 + (seed % 9) * 0.04, 2),
      movingAverage: round(3.91 + (seed % 7) * 0.035, 2),
      difference: round(-0.09 + (seed % 5) * 0.018, 2),
      curveTone: seed % 2 ? 'Restrictive but easing' : 'Tight carry regime',
    },
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export async function getStockIndexAssets() {
  try {
    return await fetchJson<StockIndexAsset[]>('/api/indices')
  } catch {
    return stockIndexAssets
  }
}

export async function getIndicesDashboard(symbolId: string) {
  try {
    return await fetchJson<IndicesDashboardData>(`/api/indices/dashboard?symbol=${encodeURIComponent(symbolId)}`)
  } catch {
    return generateIndicesDashboard(symbolId)
  }
}
