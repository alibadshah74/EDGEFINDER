import { Percent } from 'lucide-react'
import { PanelShell } from '../PanelShell'
import { cn, formatSigned } from '../../../lib/utils'
import type { InterestRateSummary } from '../../../types/market'

type InterestRateCardProps = {
  summary: InterestRateSummary
}

export function InterestRateCard({ summary }: InterestRateCardProps) {
  const rows = [
    { label: 'Current Yield', value: `${summary.currentYield.toFixed(2)}%` },
    { label: '8D Moving Avg', value: `${summary.movingAverage.toFixed(2)}%` },
    { label: 'Rate Difference', value: `${formatSigned(summary.difference)}%`, tone: summary.difference >= 0 ? 'positive' : 'negative' },
  ]

  return (
    <PanelShell title="Interest Rate Metrics" eyebrow={summary.curveTone} action={<Percent className="h-4 w-4 text-slate-500" />}>
      <div className="grid gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex min-h-12 items-center justify-between rounded border border-white/[0.075] bg-white/[0.03] px-3">
            <span className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">{row.label}</span>
            <span className={cn('text-lg font-black tabular-nums text-slate-100', row.tone === 'positive' && 'text-cyan-100', row.tone === 'negative' && 'text-orange-100')}>{row.value}</span>
          </div>
        ))}
      </div>
    </PanelShell>
  )
}
