import { memo } from 'react'
import { heatmapClass } from '../../lib/heatmap'
import { cn, formatSigned } from '../../lib/utils'

type HeatmapCellProps = {
  value: number
  inverse?: boolean
  label: string
  compact?: boolean
}

export const HeatmapCell = memo(function HeatmapCell({ value, inverse = false, label, compact = false }: HeatmapCellProps) {
  return (
    <span
      aria-label={`${label}: ${formatSigned(value)}`}
      className={cn(
        'mx-auto flex items-center justify-center rounded border font-black tabular-nums transition duration-150',
        compact ? 'h-6 min-w-8 px-1 text-[10px]' : 'h-7 min-w-10 px-2 text-[11px]',
        heatmapClass(value, inverse),
      )}
    >
      {formatSigned(value)}
    </span>
  )
})
