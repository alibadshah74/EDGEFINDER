import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Activity, DatabaseZap, Landmark, RefreshCw, Scale, Table2, Waves } from 'lucide-react'
import { getMetalsDashboard } from '../../services/metals'
import { useDashboardStore } from '../../hooks/useDashboardStore'
import { formatSigned } from '../../lib/utils'
import { AnalyticsCard } from './widgets/AnalyticsCard'
import { HeatmapTable } from './widgets/HeatmapTable'
import { MacroComparisonTable } from './widgets/MacroComparisonTable'
import { PositioningBar } from './widgets/PositioningBar'
import { SeasonalWidget } from './widgets/SeasonalWidget'
import { SentimentGauge } from './widgets/SentimentGauge'
import { YieldPanel } from './widgets/YieldPanel'

function PanelFallback() {
  return <div className="min-h-[240px] animate-pulse rounded border border-white/10 bg-white/[0.035]" />
}

export function MetalsDashboard() {
  const { metalsSymbol } = useDashboardStore()
  const dashboardQuery = useQuery({
    queryKey: ['metals-dashboard', metalsSymbol],
    queryFn: () => getMetalsDashboard(metalsSymbol),
    staleTime: 60_000,
  })

  const data = dashboardQuery.data
  const aggregateScore = useMemo(() => {
    if (!data) return '0.0'
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
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded border border-slate-700/70 bg-[#0a0f16]/95 shadow-2xl shadow-black/20">
        <div className="grid gap-3 p-3 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">{data.asset.symbol}</span>
              <span className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{data.asset.quoteCurrency} per {data.asset.unit}</span>
              <span className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Synthetic data</span>
            </div>
            <h1 className="text-xl font-black uppercase tracking-[0.12em] text-slate-50 lg:text-2xl">Gold & Silver Intelligence Workstation</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">{data.asset.name} - institutional macro, flow, seasonality, and yield analytics</p>
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
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Updated</p>
              <p className="text-xl font-black text-slate-100">{new Date(data.generatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-3 xl:grid-cols-12">
        <AnalyticsCard title="Market Bias" eyebrow="Composite directional model" action={<Scale className="h-4 w-4 text-slate-500" />} className="xl:col-span-4">
          <SentimentGauge {...data.marketBias} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded border border-white/10 bg-white/[0.035] p-2">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Bullish Share</p>
              <p className="text-lg font-black tabular-nums text-cyan-100">{data.marketBias.bullishShare}%</p>
            </div>
            <div className="rounded border border-white/10 bg-white/[0.035] p-2">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Bearish Share</p>
              <p className="text-lg font-black tabular-nums text-red-100">{data.marketBias.bearishShare}%</p>
            </div>
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Institutional Positioning" eyebrow="Commitment and imbalance" action={<Landmark className="h-4 w-4 text-slate-500" />} className="xl:col-span-4">
          <div className="space-y-4">
            <PositioningBar label="Institutional allocation" long={data.positioning.institutionalLong} short={data.positioning.institutionalShort} />
            <PositioningBar label="Positioning split" long={data.marketBias.bullishShare} short={data.marketBias.bearishShare} longLabel="Bull" shortLabel="Bear" />
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded border border-white/10 bg-white/[0.035] p-2">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Net</p>
                <p className="text-lg font-black tabular-nums text-slate-100">{formatSigned(data.positioning.netPositioning)}%</p>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.035] p-2">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Long W/W</p>
                <p className="text-lg font-black tabular-nums text-cyan-100">{formatSigned(data.positioning.weeklyLongChange)}%</p>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.035] p-2">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Imbalance</p>
                <p className="text-lg font-black tabular-nums text-slate-100">{formatSigned(data.positioning.imbalanceScore)}</p>
              </div>
            </div>
          </div>
        </AnalyticsCard>

        <div className="grid gap-3 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
          <AnalyticsCard title="Retail Sentiment" eyebrow="Contrarian crowd read" action={<Activity className="h-4 w-4 text-slate-500" />}>
            <div className="space-y-4">
              <PositioningBar label="Retail exposure" long={data.sentiment.retailLong} short={data.sentiment.retailShort} />
              <div className="rounded border border-white/10 bg-white/[0.035] p-2">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Signal</p>
                <p className="text-sm font-black text-slate-100">{data.sentiment.contrarianSignal}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{data.sentiment.institutionalInterpretation}</p>
              </div>
            </div>
          </AnalyticsCard>
          <AnalyticsCard title="Ops Feed" eyebrow="Module status" action={<DatabaseZap className="h-4 w-4 text-slate-500" />}>
            <div className="space-y-2 text-[11px] font-semibold text-slate-400">
              <p className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5 text-cyan-200" /> Cached mock API with backend-ready contract</p>
              <p className="flex items-center gap-2"><Waves className="h-3.5 w-3.5 text-slate-500" /> Macro, flow, yield, and seasonal factors</p>
            </div>
          </AnalyticsCard>
        </div>

        <AnalyticsCard title="Score Matrix" eyebrow="Precious metals factor map" action={<Table2 className="h-4 w-4 text-slate-500" />} className="xl:col-span-4">
          <HeatmapTable rows={data.scoreBreakdown} />
        </AnalyticsCard>

        <AnalyticsCard title="Macroeconomic Comparison" eyebrow="Actual, consensus, prior" action={<Landmark className="h-4 w-4 text-slate-500" />} className="xl:col-span-5">
          <MacroComparisonTable rows={data.economicMetrics} />
        </AnalyticsCard>

        <AnalyticsCard title="Seasonality" eyebrow="Historical tendency model" className="xl:col-span-3">
          <SeasonalWidget seasonality={data.seasonality} />
        </AnalyticsCard>

        <AnalyticsCard title="Yield and Interest Rate Analytics" eyebrow="Fixed-income impact model" action={<Activity className="h-4 w-4 text-slate-500" />} className="xl:col-span-12">
          <YieldPanel metrics={data.yieldMetrics} />
        </AnalyticsCard>
      </div>
    </section>
  )
}
