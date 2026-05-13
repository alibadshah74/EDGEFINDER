import { memo } from 'react'
import { cn } from '../../lib/utils'
import type { MarketBias } from '../../types/market'

const biasStyles: Record<MarketBias, string> = {
  'Very Bearish': 'border-red-300/35 bg-red-500/24 text-red-50 shadow-[inset_0_0_14px_rgba(239,68,68,0.14)]',
  Bearish: 'border-orange-300/28 bg-orange-500/16 text-orange-50',
  Neutral: 'border-white/10 bg-white/[0.055] text-slate-300',
  Bullish: 'border-teal-300/28 bg-teal-400/16 text-teal-50',
  'Very Bullish': 'border-cyan-300/35 bg-cyan-400/22 text-cyan-50 shadow-[inset_0_0_14px_rgba(34,211,238,0.14)]',
}

type BiasBadgeProps = {
  bias: MarketBias
  compact?: boolean
}

export const BiasBadge = memo(function BiasBadge({ bias, compact = false }: BiasBadgeProps) {
  return (
    <span
      className={cn(
        'mx-auto inline-flex h-6 items-center justify-center rounded border px-2 font-bold leading-none transition',
        compact ? 'max-w-24 text-[10px]' : 'min-w-24 text-[11px]',
        biasStyles[bias],
      )}
    >
      {bias}
    </span>
  )
})
