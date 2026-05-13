import { lazy, Suspense, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Activity, Gauge, LineChart, Sigma, TrendingUp, Waves } from 'lucide-react'
import { getScoreHistory, summarizeScores } from '../../services/scoreIndicator'
import { useDashboardStore } from '../../hooks/useDashboardStore'
import { cn, formatSigned } from '../../lib/utils'
import { ScoreSkeleton } from './ScoreSkeleton'

const ScoreIndicatorChart = lazy(() => import('../charts/ScoreIndicatorChart').then((module) => ({ default: module.ScoreIndicatorChart })))

const statMeta = [
  { label: 'Latest Score', key: 'latestScore', icon: Gauge },
  { label: 'Average', key: 'averageScore', icon: Sigma },
  { label: 'Score Delta', key: 'scoreDelta', icon: Activity },
  { label: 'High', key: 'highScore', icon: TrendingUp },
  { label: 'Low', key: 'lowScore', icon: Waves },
  { label: 'Trend Delta', key: 'trendDelta', icon: LineChart },
] as const

export function ScoreIndicatorPage() {
  const { scoreAsset, dateRange } = useDashboardStore()
  const historyQuery = useQuery({
    queryKey: ['score-history', scoreAsset, dateRange],
    queryFn: () => getScoreHistory(scoreAsset, dateRange),
    staleTime: 60_000,
  })

  const summary = useMemo(() => summarizeScores(historyQuery.data ?? []), [historyQuery.data])

  if (historyQuery.isLoading) return <ScoreSkeleton />

  return (
    <section className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        {statMeta.map((item, index) => {
          const Icon = item.icon
          const value = summary[item.key]
          const positive = value > 0
          const signed = item.key.includes('Delta')

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              className="rounded border border-white/10 bg-[#0d131d]/88 p-3 shadow-lg shadow-black/15"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{item.label}</span>
                <Icon className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              </div>
              <p className={cn('text-2xl font-black tabular-nums text-slate-100', signed && (positive ? 'text-emerald-200' : value < 0 ? 'text-orange-200' : 'text-slate-200'))}>
                {signed ? formatSigned(value) : value}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="rounded border border-white/10 bg-[#0a0f17]/82 p-2 shadow-2xl shadow-black/20">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-2 py-2">
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.16em] text-slate-100">Score Indicator</h1>
            <p className="mt-1 text-xs text-slate-500">Fictional macro score bars with a synthetic trend overlay</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#6d8dff]" /> Positive</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#687080]" /> Neutral</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#df735d]" /> Negative</span>
            <span className="inline-flex items-center gap-1"><span className="h-0.5 w-5 bg-[#d3ca6a]" /> Trend</span>
          </div>
        </div>
        <Suspense fallback={<ScoreSkeleton />}>
          <ScoreIndicatorChart data={historyQuery.data ?? []} />
        </Suspense>
      </div>
    </section>
  )
}
