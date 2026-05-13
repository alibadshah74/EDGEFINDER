import type { DateRangeKey, ScoreAsset, ScoreHistoryPoint, ScoreSummary } from '../types/market'

const assets: ScoreAsset[] = [
  { id: 'G10-FX', symbol: 'G10FX', name: 'G10 Currency Composite', assetClass: 'FX', region: 'Global' },
  { id: 'US-EQ', symbol: 'USEQ', name: 'US Equity Breadth', assetClass: 'Equity Index', region: 'United States' },
  { id: 'XAU-XAG', symbol: 'PMET', name: 'Precious Metals Pair', assetClass: 'Metals', region: 'Global' },
  { id: 'UST-10Y', symbol: 'UST10', name: 'Treasury Duration Proxy', assetClass: 'Rates', region: 'United States' },
  { id: 'DIGI-BETA', symbol: 'DBETA', name: 'Digital Beta Basket', assetClass: 'Crypto', region: 'Global' },
]

const rangeDays: Record<DateRangeKey, number> = {
  '30D': 30,
  '90D': 90,
  '6M': 180,
  '1Y': 365,
}

const seedFrom = (value: string) => Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0)

function seededWave(index: number, seed: number) {
  return Math.sin(index / 5.6 + seed * 0.07) * 4.8 + Math.cos(index / 12 + seed * 0.03) * 3.1
}

export function generateScoreHistory(assetId: string, range: DateRangeKey): ScoreHistoryPoint[] {
  const days = rangeDays[range]
  const seed = seedFrom(assetId)
  const today = new Date('2026-05-13T00:00:00.000Z')
  let trend = 100 + (seed % 19)

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - (days - index - 1))
    const pulse = seededWave(index, seed)
    const score = Math.max(-10, Math.min(10, Math.round(pulse + Math.sin(index / 2.7) * 1.8 + ((seed % 7) - 3) * 0.35)))
    trend += score * 0.22 + Math.sin(index / 8 + seed) * 0.55
    const volatility = Math.abs(score) * 1.7 + 8 + (index % 9) * 0.35
    const regime = score >= 4 ? 'Risk-On' : score <= -4 ? 'Risk-Off' : 'Neutral'

    return {
      timestamp: date.toISOString(),
      score,
      trend: Number(trend.toFixed(2)),
      volatility: Number(volatility.toFixed(2)),
      regime,
    }
  })
}

export function summarizeScores(points: ScoreHistoryPoint[]): ScoreSummary {
  if (!points.length) {
    return { latestScore: 0, averageScore: 0, scoreDelta: 0, highScore: 0, lowScore: 0, trendDelta: 0 }
  }

  const latest = points.at(-1)!
  const previous = points.at(-2) ?? latest
  const scores = points.map((point) => point.score)
  const averageScore = scores.reduce((sum, value) => sum + value, 0) / scores.length

  return {
    latestScore: latest.score,
    averageScore: Number(averageScore.toFixed(1)),
    scoreDelta: latest.score - previous.score,
    highScore: Math.max(...scores),
    lowScore: Math.min(...scores),
    trendDelta: Number((latest.trend - points[0].trend).toFixed(2)),
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export async function getScoreAssets() {
  try {
    return await fetchJson<ScoreAsset[]>('/api/assets')
  } catch {
    return assets
  }
}

export async function getScoreHistory(assetId: string, range: DateRangeKey) {
  try {
    return await fetchJson<ScoreHistoryPoint[]>(`/api/scores/history?asset_id=${assetId}&range=${range}`)
  } catch {
    return generateScoreHistory(assetId, range)
  }
}
