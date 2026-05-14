import { lazy, Suspense, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CircleHelp, Clock3, DatabaseZap, RefreshCw } from 'lucide-react'
import { getIndicesDashboard } from '../../services/stockIndices'
import { useDashboardStore } from '../../hooks/useDashboardStore'
import { MarketBiasGauge } from './panels/MarketBiasGauge'
import { PositioningPanel } from './panels/PositioningPanel'
import { ScoreBreakdownTable } from './panels/ScoreBreakdownTable'
import { EconomicComparisonPanel } from './panels/EconomicComparisonPanel'
import { SeasonalityCard } from './panels/SeasonalityCard'
import { InterestRateCard } from './panels/InterestRateCard'

const PutCallRatioChart = lazy(() => import('./charts/PutCallRatioChart').then((module) => ({ default: module.PutCallRatioChart })))
const SentimentStackChart = lazy(() => import('./charts/SentimentStackChart').then((module) => ({ default: module.SentimentStackChart })))

function PanelFallback() {
  return <div className="min-h-[280px] animate-pulse rounded border border-white/10 bg-white/[0.035]" />
}

export function StockIndicesDashboard() {
  const { stockIndexSymbol } = useDashboardStore()
  const dashboardQuery = useQuery({
    queryKey: ['stock-indices-dashboard', stockIndexSymbol],
    queryFn: () => getIndicesDashboard(stockIndexSymbol),
    staleTime: 60_000,
  })

  const data = dashboardQuery.data
  const aggregateScore = useMemo(() => {
    if (!data) return 0
    return data.scoreBreakdown.reduce((sum, row) => sum + row.score, 0).toFixed(1)
  }, [data])

  if (!data) {
    return (
      <div className="grid gap-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => <PanelFallback key={index} />)}
      </div>
    )
  }

  return (
    <section className="space-y-3">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded border border-white/10 bg-[#0b1017]/90 shadow-2xl shadow-black/20">
        <div className="grid gap-3 p-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">{data.asset.symbol}</span>
              <span className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{data.asset.region}</span>
            </div>
            <h1 className="text-xl font-black uppercase tracking-[0.12em] text-slate-50 lg:text-2xl">Stock Indices Intelligence Dashboard</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">{data.asset.name} · fictional institutional analytics workspace</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-right">
            <div className="rounded border border-white/10 bg-white/[0.035] p-2">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Bias Score</p>
              <p className="text-xl font-black text-cyan-100">{data.marketBias.score}</p>
            </div>
            <div className="rounded border border-white/10 bg-white/[0.035] p-2">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Net Model</p>
              <p className="text-xl font-black text-slate-100">{aggregateScore}</p>
            </div>
            <div className="rounded border border-white/10 bg-white/[0.035] p-2">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Currency</p>
              <p className="text-xl font-black text-slate-100">{data.asset.currency}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-3 xl:grid-cols-12">
        <div className="xl:col-span-4"><MarketBiasGauge {...data.marketBias} /></div>
        <div className="xl:col-span-4"><PositioningPanel positioning={data.positioning} /></div>
        <div className="xl:col-span-4">
          <div className="grid h-full gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <InterestRateCard summary={data.interestRates} />
            <div className="rounded border border-white/10 bg-[#0b1017]/88 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-100">Ops Feed</p>
                <DatabaseZap className="h-4 w-4 text-slate-500" />
              </div>
              <div className="space-y-2 text-[11px] font-semibold text-slate-400">
                <p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-cyan-200" /> Refreshed {new Date(data.generatedAt).toLocaleDateString()}</p>
                <p className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5 text-teal-200" /> Cached aggregate endpoints</p>
                <p className="flex items-center gap-2"><CircleHelp className="h-3.5 w-3.5 text-slate-500" /> Fictional data for UI validation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7">
          <Suspense fallback={<PanelFallback />}>
            <PutCallRatioChart data={data.putCallRatio} />
          </Suspense>
        </div>
        <div className="xl:col-span-5"><ScoreBreakdownTable rows={data.scoreBreakdown} /></div>

        <div className="xl:col-span-5"><EconomicComparisonPanel rows={data.economicMetrics} /></div>
        <div className="xl:col-span-4">
          <Suspense fallback={<PanelFallback />}>
            <SentimentStackChart data={data.sentiment} />
          </Suspense>
        </div>
        <div className="xl:col-span-3"><SeasonalityCard summary={data.seasonality} /></div>
      </div>
    </section>
  )
}
