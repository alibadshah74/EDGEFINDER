import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { HeaderToolbar } from '../header/HeaderToolbar'
import { Sidebar } from '../sidebar/Sidebar'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'
import { MarketHeatmapTable } from '../heatmap-table/MarketHeatmapTable'
import { useDashboardStore } from '../../hooks/useDashboardStore'
import { generateMarketData } from '../../mock-data/marketData'

const allMarketData = generateMarketData(64)
const ScoreIndicatorPage = lazy(() => import('../score-indicator/ScoreIndicatorPage').then((module) => ({ default: module.ScoreIndicatorPage })))

export function DashboardLayout() {
  const [loading, setLoading] = useState(true)
  const { collapsed, search, assetFilter, category, biasFilter, activeNav } = useDashboardStore()

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650)
    return () => window.clearTimeout(timer)
  }, [])

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase()

    return allMarketData.filter((asset) => {
      const assetMatch = assetFilter === 'All Assets' || asset.assetClass === assetFilter
      const categoryMatch = category === 'All Markets' || asset.desk === category
      const biasMatch = biasFilter === 'All Bias' || asset.bias === biasFilter
      const searchMatch = !term || asset.asset.toLowerCase().includes(term) || asset.bias.toLowerCase().includes(term) || asset.desk.toLowerCase().includes(term) || asset.assetClass.toLowerCase().includes(term)
      return assetMatch && categoryMatch && biasMatch && searchMatch
    })
  }, [assetFilter, biasFilter, category, search])

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.12),transparent_34%),linear-gradient(135deg,rgba(16,185,129,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_42%)]" />
      <Sidebar />
      <div className="relative transition-[padding] duration-300" style={{ paddingLeft: collapsed ? 54 : 196 }}>
        <HeaderToolbar />
        <main className="p-2.5 lg:p-3">
          {activeNav === 'EF Score Indicator' ? (
            <Suspense fallback={<LoadingSkeleton />}>
              <ScoreIndicatorPage />
            </Suspense>
          ) : loading ? (
            <LoadingSkeleton />
          ) : (
            <MarketHeatmapTable data={filteredData} compact={collapsed} />
          )}
        </main>
      </div>
    </div>
  )
}
