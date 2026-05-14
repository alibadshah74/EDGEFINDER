import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MetalsDashboardData } from '../../../types/market'

type SeasonalWidgetProps = {
  seasonality: MetalsDashboardData['seasonality']
}

export function SeasonalWidget({ seasonality }: SeasonalWidgetProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded border border-white/10 bg-white/[0.035] p-2">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Month</p>
          <p className="text-lg font-black text-slate-100">{seasonality.month}</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.035] p-2">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Avg Perf</p>
          <p className="text-lg font-black tabular-nums text-cyan-100">{seasonality.averagePerformance.toFixed(2)}%</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.035] p-2">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Prob</p>
          <p className="text-lg font-black tabular-nums text-slate-100">{seasonality.hitRate}%</p>
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={seasonality.curve} margin={{ top: 6, right: 4, left: -24, bottom: 0 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} contentStyle={{ background: '#0b1017', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 4, color: '#e2e8f0' }} />
            <Bar dataKey="performance" fill="#69bdca" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
