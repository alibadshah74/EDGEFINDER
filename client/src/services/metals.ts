import type { MetalsDashboardData, PreciousMetalAsset } from '../types/market'

export const metalAssets: PreciousMetalAsset[] = [
  { id: 'XAU-USD', symbol: 'GOLD', name: 'Gold Macro Composite', unit: 'troy oz', quoteCurrency: 'USD' },
  { id: 'XAG-USD', symbol: 'SILVER', name: 'Silver Macro Composite', unit: 'troy oz', quoteCurrency: 'USD' },
  { id: 'XAU-XAG', symbol: 'GSR', name: 'Gold Silver Ratio', unit: 'ratio', quoteCurrency: 'USD' },
]

const seedFrom = (value: string) => Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0)
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const round = (value: number, digits = 1) => Number(value.toFixed(digits))

function biasLevel(score: number): MetalsDashboardData['marketBias']['level'] {
  if (score >= 78) return 'Very Bullish'
  if (score >= 58) return 'Bullish'
  if (score >= 43) return 'Neutral'
  if (score >= 24) return 'Bearish'
  return 'Very Bearish'
}

export function generateMetalsDashboard(symbolId = 'XAU-USD'): MetalsDashboardData {
  const asset = metalAssets.find((item) => item.id === symbolId) ?? metalAssets[0]
  const seed = seedFrom(asset.id)
  const today = new Date('2026-05-14T00:00:00.000Z')
  const score = clamp(Math.round(61 + Math.sin(seed * 0.09) * 21 - (asset.id === 'XAG-USD' ? 8 : 0)), 14, 93)
  const instLong = clamp(57 + Math.sin(seed * 0.7) * 16, 31, 82)
  const retailLong = clamp(38 + Math.cos(seed * 0.41) * 20, 14, 86)
  const bullishShare = Math.round(clamp(50 + Math.sin(seed * 0.22) * 18, 24, 78))

  const scoreSeeds: Array<[string, number, number]> = [
    ['Overall Score', score / 18 - 2.2, 0.3],
    ['Positioning', 1.9, 0.4],
    ['Retail Sentiment', -1.1, -0.2],
    ['Seasonality', 1.2, 0.5],
    ['Trend Structure', 1.8, 0.2],
    ['GDP', -0.4, -0.1],
    ['Manufacturing PMI', asset.id === 'XAG-USD' ? 1.3 : 0.3, 0.2],
    ['Services PMI', 0.8, 0.1],
    ['Retail Sales', -0.6, -0.3],
    ['Inflation', 1.6, 0.4],
    ['Employment', 0.4, -0.2],
    ['Interest Rates', -1.5, -0.4],
  ]

  const economicMetrics = [
    ['GDP Growth', '2.2%', '2.1%', '2.4%', 0.1, '%'],
    ['Manufacturing PMI', '50.9', '50.3', '49.8', 0.6, 'pts'],
    ['Services PMI', '53.2', '52.7', '52.9', 0.5, 'pts'],
    ['Retail Sales', '0.2%', '0.4%', '0.6%', -0.2, '%'],
    ['CPI YoY', '2.8%', '2.9%', '3.0%', -0.1, '%'],
    ['Core CPI', '0.3%', '0.3%', '0.2%', 0, '%'],
    ['Employment Data', '166k', '158k', '151k', 8, 'k'],
    ['Unemployment Rate', '4.1%', '4.0%', '4.1%', 0.1, '%'],
  ].map(([metric, actual, forecast, previous, change, unit]) => ({
    metric: String(metric),
    actual: String(actual),
    forecast: String(forecast),
    previous: String(previous),
    change: Number(change),
    unit: String(unit),
  }))

  const monthly = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => ({
    month,
    performance: round(Math.sin(index * 0.74 + seed * 0.03) * 1.15 + Math.cos(index * 0.31) * 0.45, 2),
    probability: Math.round(clamp(51 + Math.sin(index + seed * 0.05) * 19, 38, 77)),
  }))

  const trend = Array.from({ length: 32 }, (_, index) => {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - (31 - index))
    return {
      date: date.toISOString(),
      yield: round(4.28 + Math.sin(index / 4 + seed * 0.02) * 0.16 + index * 0.002, 2),
      realYield: round(1.84 + Math.cos(index / 5 + seed * 0.03) * 0.12 - index * 0.001, 2),
    }
  })

  return {
    asset,
    generatedAt: today.toISOString(),
    marketBias: {
      level: biasLevel(score),
      score,
      confidence: Math.round(clamp(66 + (seed % 21), 58, 92)),
      bullishShare,
      bearishShare: 100 - bullishShare,
    },
    positioning: {
      institutionalLong: round(instLong, 1),
      institutionalShort: round(100 - instLong, 1),
      retailLong: round(retailLong, 1),
      retailShort: round(100 - retailLong, 1),
      weeklyLongChange: round(Math.sin(seed) * 2.1, 1),
      weeklyShortChange: round(Math.cos(seed) * 1.9, 1),
      netPositioning: round(instLong - (100 - instLong), 1),
      imbalanceScore: round((instLong - retailLong) / 10, 1),
    },
    scoreBreakdown: scoreSeeds.map(([indicator, base, delta], index) => ({
      indicator,
      score: round(Number(base) + Math.sin(seed * 0.06 + index) * 0.55, 1),
      delta: round(Number(delta) + Math.cos(seed * 0.05 + index) * 0.22, 1),
    })),
    economicMetrics,
    seasonality: {
      month: 'May',
      averagePerformance: monthly[4].performance,
      hitRate: monthly[4].probability,
      multiYearWindow: '15 year synthetic window',
      tone: monthly[4].performance > 0.35 ? 'Positive' : monthly[4].performance < -0.35 ? 'Negative' : 'Neutral',
      monthly: monthly.map(({ month, performance }) => ({ month, performance })),
      curve: monthly,
    },
    yieldMetrics: {
      curveTone: score > 58 ? 'Real yields fading; metals carry improving' : 'Yield pressure remains restrictive',
      realYieldPressure: round(-0.7 + Math.sin(seed * 0.1) * 0.5, 2),
      dollarSensitivity: round(0.62 + Math.cos(seed * 0.04) * 0.18, 2),
      rows: [
        { tenor: '2Y Treasury', currentYield: 4.28, movingAverage: 4.34, spread: -0.06, delta: -0.03 },
        { tenor: '10Y Treasury', currentYield: 4.05, movingAverage: 4.11, spread: -0.23, delta: -0.04 },
        { tenor: 'Real Yield Proxy', currentYield: 1.82, movingAverage: 1.91, spread: -0.09, delta: -0.05 },
        { tenor: '2Y/10Y Spread', currentYield: -0.23, movingAverage: -0.20, spread: -0.03, delta: -0.02 },
      ],
      trend,
    },
    sentiment: {
      retailLong: round(retailLong, 1),
      retailShort: round(100 - retailLong, 1),
      contrarianSignal: retailLong > 62 ? 'Contrarian headwind' : retailLong < 38 ? 'Contrarian tailwind' : 'Balanced retail flow',
      institutionalInterpretation: retailLong < instLong ? 'Institutional flow leads retail positioning' : 'Retail exposure is crowded versus institutional flow',
      cohorts: [
        { cohort: 'Macro Funds', bullish: 55, neutral: 27, bearish: 18 },
        { cohort: 'CTA Models', bullish: 46, neutral: 34, bearish: 20 },
        { cohort: 'Options Desks', bullish: 41, neutral: 29, bearish: 30 },
        { cohort: 'Retail Flow', bullish: Math.round(retailLong), neutral: 14, bearish: Math.round(86 - retailLong) },
      ],
    },
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export async function getMetalAssets() {
  try {
    return await fetchJson<PreciousMetalAsset[]>('/api/metals')
  } catch {
    return metalAssets
  }
}

export async function getMetalsDashboard(symbolId: string) {
  try {
    return await fetchJson<MetalsDashboardData>(`/api/metals/dashboard?symbol=${encodeURIComponent(symbolId)}`)
  } catch {
    return generateMetalsDashboard(symbolId)
  }
}
