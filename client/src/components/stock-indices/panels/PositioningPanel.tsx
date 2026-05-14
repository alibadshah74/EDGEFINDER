import { ArrowDownRight, ArrowUpRight, Landmark } from 'lucide-react'
import { PanelShell } from '../PanelShell'
import { cn, formatSigned } from '../../../lib/utils'
import type { PositioningSnapshot } from '../../../types/market'

type PositioningPanelProps = {
  positioning: PositioningSnapshot
}

function SegmentRow({ label, long, short }: { label: string; long: number; short: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
        <span>{label}</span>
        <span className="tabular-nums text-slate-500">{long.toFixed(1)} / {short.toFixed(1)}</span>
      </div>
      <div className="flex h-8 overflow-hidden rounded border border-white/10 bg-slate-950/60">
        <div className="grid place-items-center bg-[#48bccb]/80 text-[10px] font-black text-slate-950" style={{ width: `${long}%` }}>
          {long.toFixed(1)}%
        </div>
        <div className="grid place-items-center bg-[#c96d5a]/82 text-[10px] font-black text-slate-950" style={{ width: `${short}%` }}>
          {short.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

export function PositioningPanel({ positioning }: PositioningPanelProps) {
  const deltas = [
    { label: 'Long W/W', value: positioning.weeklyLongChange },
    { label: 'Short W/W', value: positioning.weeklyShortChange },
  ]

  return (
    <PanelShell title="Positioning Analysis" eyebrow="Fictional flow mix" action={<Landmark className="h-4 w-4 text-slate-500" />}>
      <div className="space-y-4">
        <SegmentRow label="Institutional positioning" long={positioning.institutionalLong} short={positioning.institutionalShort} />
        <SegmentRow label="Retail positioning" long={positioning.retailLong} short={positioning.retailShort} />
        <div className="grid grid-cols-2 gap-2">
          {deltas.map((item) => {
            const positive = item.value >= 0
            const Icon = positive ? ArrowUpRight : ArrowDownRight
            return (
              <div key={item.label} className="rounded border border-white/10 bg-white/[0.035] p-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{item.label}</span>
                  <Icon className={cn('h-3.5 w-3.5', positive ? 'text-cyan-200' : 'text-orange-200')} />
                </div>
                <p className={cn('text-lg font-black tabular-nums', positive ? 'text-cyan-100' : 'text-orange-100')}>{formatSigned(item.value)}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </PanelShell>
  )
}
