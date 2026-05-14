import { cn, formatSigned } from '../../../lib/utils'
import type { EconomicMetricRow } from '../../../types/market'

type MacroComparisonTableProps = {
  rows: EconomicMetricRow[]
}

function deltaClass(value: number) {
  if (value > 0) return 'border-cyan-300/20 bg-cyan-300/14 text-cyan-50'
  if (value < 0) return 'border-red-300/20 bg-red-300/14 text-red-50'
  return 'border-white/10 bg-white/[0.04] text-slate-200'
}

export function MacroComparisonTable({ rows }: MacroComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[580px]">
        <div className="grid grid-cols-[1.15fr_0.7fr_0.7fr_0.7fr_0.7fr] gap-2 px-2 text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">
          <span>Metric</span>
          <span className="text-right">Actual</span>
          <span className="text-right">Forecast</span>
          <span className="text-right">Previous</span>
          <span className="text-right">Change</span>
        </div>
        <div className="mt-1 grid gap-1.5">
          {rows.map((row) => (
            <div key={row.metric} className="grid min-h-9 grid-cols-[1.15fr_0.7fr_0.7fr_0.7fr_0.7fr] items-center gap-2 rounded border border-white/[0.07] bg-white/[0.025] px-2 text-xs">
              <span className="truncate font-bold text-slate-300">{row.metric}</span>
              <span className="text-right font-black tabular-nums text-slate-100">{row.actual}</span>
              <span className="text-right tabular-nums text-slate-500">{row.forecast}</span>
              <span className="text-right tabular-nums text-slate-500">{row.previous ?? '-'}</span>
              <span className="text-right">
                <span className={cn('inline-grid min-w-14 place-items-center rounded border px-1.5 py-1 font-black tabular-nums', deltaClass(row.change))}>
                  {formatSigned(row.change)}
                  {row.unit === '%' ? '%' : row.unit === 'pts' ? '' : row.unit}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
