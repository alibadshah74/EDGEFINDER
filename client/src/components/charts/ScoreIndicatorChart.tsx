import { memo, useMemo } from 'react'
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ScoreHistoryPoint } from '../../types/market'

type ScoreIndicatorChartProps = {
  data: ScoreHistoryPoint[]
}

type ChartPoint = ScoreHistoryPoint & {
  day: string
  shortDay: string
}

function scoreFill(score: number) {
  if (score > 2) return '#6d8dff'
  if (score < -2) return '#df735d'
  return '#687080'
}

function TooltipContent({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload as ChartPoint

  return (
    <div className="min-w-48 rounded border border-white/12 bg-[#0b1018]/96 p-3 text-xs shadow-2xl shadow-black/35 backdrop-blur-xl">
      <p className="mb-2 font-black uppercase tracking-[0.12em] text-slate-300">{label}</p>
      <div className="space-y-1.5">
        <p className="flex justify-between gap-6 text-slate-400"><span>Market score</span><span className="font-black text-slate-50">{point.score}</span></p>
        <p className="flex justify-between gap-6 text-slate-400"><span>Trend proxy</span><span className="font-black text-emerald-100">{point.trend.toFixed(2)}</span></p>
        <p className="flex justify-between gap-6 text-slate-400"><span>Volatility</span><span className="font-black text-slate-100">{point.volatility.toFixed(1)}</span></p>
        <p className="flex justify-between gap-6 text-slate-400"><span>Regime</span><span className="font-black text-slate-100">{point.regime}</span></p>
      </div>
    </div>
  )
}

export const ScoreIndicatorChart = memo(function ScoreIndicatorChart({ data }: ScoreIndicatorChartProps) {
  const chartData = useMemo<ChartPoint[]>(
    () =>
      data.map((point) => {
        const date = new Date(point.timestamp)
        return {
          ...point,
          day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          shortDay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }
      }),
    [data],
  )

  const [minTrend, maxTrend] = useMemo(() => {
    const values = chartData.map((point) => point.trend)
    return [Math.min(...values) - 4, Math.max(...values) + 4]
  }, [chartData])

  if (!chartData.length) {
    return (
      <div className="grid h-[62vh] place-items-center rounded border border-white/10 bg-[#0d121a]/92 text-center">
        <div>
          <p className="text-sm font-black text-slate-100">No score history available</p>
          <p className="mt-1 text-xs text-slate-500">Change the asset or date range to regenerate the synthetic analytics view.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[62vh] min-h-115 rounded border border-white/10 bg-[#0d121a]/92 p-3 shadow-2xl shadow-black/25">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 18, right: 16, bottom: 16, left: 0 }}>
          <defs>
            <linearGradient id="trendLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#66e2bc" />
              <stop offset="55%" stopColor="#d3ca6a" />
              <stop offset="100%" stopColor="#f0a766" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.13)" vertical={false} />
          <XAxis dataKey="shortDay" minTickGap={22} tick={{ fill: '#8290a4', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'rgba(148,163,184,0.22)' }} />
          <YAxis yAxisId="score" domain={[-10, 10]} tickCount={9} tick={{ fill: '#8290a4', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'rgba(148,163,184,0.22)' }} />
          <YAxis yAxisId="trend" orientation="right" domain={[minTrend, maxTrend]} tick={{ fill: '#697689', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(255,255,255,0.035)' }} />
          <Bar yAxisId="score" dataKey="score" radius={[3, 3, 0, 0]} barSize={chartData.length > 120 ? 4 : 8} animationDuration={760}>
            {chartData.map((point) => (
              <Cell key={point.timestamp} fill={scoreFill(point.score)} opacity={point.score === 0 ? 0.62 : 0.92} />
            ))}
          </Bar>
          <Line yAxisId="trend" type="monotone" dataKey="trend" stroke="url(#trendLine)" strokeWidth={2.4} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#f5d67a' }} animationDuration={880} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
})
