import { Table2 } from 'lucide-react'
import { PanelShell } from '../PanelShell'
import { cn, formatSigned } from '../../../lib/utils'
import type { ScoreBreakdownRow } from '../../../types/market'

type ScoreBreakdownTableProps = {
  rows: ScoreBreakdownRow[]
}

function heatClass(value: number) {
  if (value >= 1.5) return 'bg-cyan-300/24 text-cyan-50'
  if (value > 0) return 'bg-teal-300/14 text-teal-50'
  if (value <= -1.5) return 'bg-orange-400/24 text-orange-50'
  if (value < 0) return 'bg-red-300/14 text-red-50'
  return 'bg-white/[0.035] text-slate-200'
}

export function ScoreBreakdownTable({ rows }: ScoreBreakdownTableProps) {
  return (
    <PanelShell title="Score Breakdown" eyebrow="Indicator map" action={<Table2 className="h-4 w-4 text-slate-500" />}>
      <div className="max-h-[386px] overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#0b1017] text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">
            <tr>
              <th className="border-b border-white/10 py-2 pr-2">Indicator</th>
              <th className="border-b border-white/10 px-1 text-right">Score</th>
              <th className="border-b border-white/10 pl-1 text-right">Delta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.indicator} className="border-b border-white/[0.065] text-xs">
                <td className="py-2 pr-2 font-semibold text-slate-300">{row.indicator}</td>
                <td className="px-1 py-1 text-right">
                  <span className={cn('inline-grid min-w-14 place-items-center rounded px-2 py-1 font-black tabular-nums', heatClass(row.score))}>{formatSigned(row.score)}</span>
                </td>
                <td className="py-1 pl-1 text-right">
                  <span className={cn('inline-grid min-w-12 place-items-center rounded px-2 py-1 font-black tabular-nums', heatClass(row.delta))}>{formatSigned(row.delta)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  )
}
