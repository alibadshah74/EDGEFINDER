import { CalendarRange } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { PanelShell } from '../PanelShell'
import { cn, formatSigned } from '../../../lib/utils'
import type { SeasonalitySummary } from '../../../types/market'

type SeasonalityCardProps = {
  summary: SeasonalitySummary
}

export function SeasonalityCard({ summary }: SeasonalityCardProps) {
  const positive = summary.averagePerformance >= 0

  return (
    <PanelShell title="Seasonality" eyebrow={summary.multiYearWindow} action={<CalendarRange className="h-4 w-4 text-slate-500" />}>
      <div className="grid gap-3">
        <div className={cn('rounded border p-3', positive ? 'border-cyan-300/18 bg-cyan-300/10' : 'border-orange-300/18 bg-orange-300/10')}>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{summary.month} average performance</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className={cn('text-3xl font-black tabular-nums', positive ? 'text-cyan-100' : 'text-orange-100')}>{formatSigned(summary.averagePerformance)}%</p>
            <div className="text-right">
              <p className="text-xs font-black text-slate-200">{summary.tone}</p>
              <p className="text-[10px] font-bold text-slate-500">{summary.hitRate}% hit rate</p>
            </div>
          </div>
        </div>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.monthly} margin={{ top: 4, right: 0, bottom: 0, left: -28 }}>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Bar dataKey="performance" radius={[2, 2, 0, 0]} fill="#55c7d3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PanelShell>
  )
}
