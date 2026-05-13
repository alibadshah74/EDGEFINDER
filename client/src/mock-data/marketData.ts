import type { AssetFilter, MarketAsset, MarketBias, MarketCategory } from '../types/market'

const assetRoots = [
  'Aster',
  'Northline',
  'Meridian',
  'Helio',
  'Cobalt',
  'Atlas',
  'Vector',
  'Harbor',
  'Crescent',
  'Summit',
  'Orion',
  'Lattice',
  'Praxis',
  'Vale',
  'Sierra',
  'Noble',
  'Keystone',
  'Mariner',
  'Solace',
  'Argent',
  'Granite',
  'Ion',
  'Ember',
  'Vantage',
  'Pioneer',
  'Strata',
  'Arcadia',
  'Sterling',
]

const categories: MarketCategory[] = ['Equities', 'Metals', 'Currency', 'Rates']

const assetClasses: Exclude<AssetFilter, 'All Assets'>[] = ['Indices', 'Metals', 'FX Pairs', 'Rate Curves']

function seededWave(index: number, salt: number) {
  return Math.sin(index * 1.73 + salt) + Math.cos(index * 0.61 + salt * 1.9)
}

function indicator(index: number, salt: number) {
  const raw = seededWave(index, salt)
  if (raw > 1.05) return 2
  if (raw > 0.26) return 1
  if (raw < -1.05) return -2
  if (raw < -0.26) return -1
  return 0
}

function biasFromScore(score: number): MarketBias {
  if (score >= 8) return 'Very Bullish'
  if (score >= 3) return 'Bullish'
  if (score <= -8) return 'Very Bearish'
  if (score <= -3) return 'Bearish'
  return 'Neutral'
}

export function generateMarketData(count = 48): MarketAsset[] {
  return Array.from({ length: count }, (_, index) => {
    const desk = categories[index % categories.length]
    const assetClass = assetClasses[index % assetClasses.length]
    const cot = indicator(index, 0.7)
    const retailPos = indicator(index, 1.4)
    const seasonality = indicator(index, 2.2)
    const trend = indicator(index, 3.1)
    const gdp = indicator(index, 4.2)
    const mPMI = indicator(index, 5.4)
    const sPMI = indicator(index, 6.3)
    const retailSales = indicator(index, 7.5)
    const inflation = indicator(index, 8.6)
    const employmentChange = indicator(index, 9.7)
    const unemploymentRate = indicator(index, 10.8)
    const interestRate = indicator(index, 11.9)
    const score = cot + retailPos + seasonality + trend + gdp + mPMI + sPMI + retailSales + employmentChange - inflation - unemploymentRate - interestRate

    return {
      id: `mk-${index + 1}`,
      asset: `${assetRoots[index % assetRoots.length]} ${assetClass === 'Rate Curves' ? 'Curve' : assetClass === 'FX Pairs' ? 'FX' : assetClass === 'Metals' ? 'Metal' : 'Index'}`,
      assetClass,
      desk,
      bias: biasFromScore(score),
      score,
      cot,
      retailPos,
      seasonality,
      trend,
      gdp,
      mPMI,
      sPMI,
      retailSales,
      inflation,
      employmentChange,
      unemploymentRate,
      interestRate,
      lastUpdated: `${String(8 + (index % 11)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
    }
  })
}
