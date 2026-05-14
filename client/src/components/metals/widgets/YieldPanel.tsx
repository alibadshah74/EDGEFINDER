import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn, formatSigned } from '../../../lib/utils'
import type { MetalsDashboardData } from '../../../types/market'

type YieldPanelProps = {
  metrics: MetalsDashboardData['yieldMetrics']
}

function tone(value: number) {
  if (value > 0) return 'text-red-100 bg-red-300/14'
  if (value < 0) return 'text-cyan-100 bg-cyan-300/14'
  return 'text-slate-200 bg-white/[0.04]'
}

export function YieldPanel({ metrics }: YieldPanelProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr]">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded border border-white/10 bg-white/[0.035] p-2">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Real Yield Pressure</p>
            <p className="text-xl font-black tabular-nums text-cyan-100">{formatSigned(metrics.realYieldPressure)}</p>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.035] p-2">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">USD Sensitivity</p>
            <p className="text-xl font-black tabular-nums text-slate-100">{metrics.dollarSensitivity.toFixed(2)}</p>
          </div>
        </div>
        <p className="rounded border border-slate-700/70 bg-slate-900/60 px-2 py-2 text-xs font-semibold text-slate-300">{metrics.curveTone}</p>
        <div className="overflow-hidden rounded border border-slate-700/70">
          {metrics.rows.map((row) => (
            <div key={row.tenor} className="grid grid-cols-[1fr_0.7fr_0.7fr_0.7fr] items-center border-b border-white/[0.06] px-2 py-2 text-xs last:border-b-0">
              <span className="font-bold text-slate-300">{row.tenor}</span>
              <span className="text-right font-black tabular-nums text-slate-100">{row.currentYield.toFixed(2)}%</span>
              <span className="text-right tabular-nums text-slate-500">{row.movingAverage.toFixed(2)}%</span>
              <span className="text-right">
                <span className={cn('rounded px-1.5 py-1 font-black tabular-nums', tone(row.delta))}>{formatSigned(row.delta)}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-64 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics.trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" hide />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0b1017', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 4, color: '#e2e8f0' }} />
            <Area type="monotone" dataKey="yield" stroke="#79c2d0" fill="rgba(121,194,208,0.16)" strokeWidth={2} />
            <Area type="monotone" dataKey="realYield" stroke="#c58372" fill="rgba(197,131,114,0.10)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
