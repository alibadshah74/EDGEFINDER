import { motion } from 'framer-motion'

type PositioningBarProps = {
  label: string
  long: number
  short: number
  longLabel?: string
  shortLabel?: string
}

export function PositioningBar({ label, long, short, longLabel = 'Long', shortLabel = 'Short' }: PositioningBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-slate-300">{label}</span>
        <span className="tabular-nums text-slate-500">{long.toFixed(1)} / {short.toFixed(1)}</span>
      </div>
      <div className="flex h-8 overflow-hidden rounded border border-slate-700/70 bg-slate-950/70">
        <motion.div
          className="grid min-w-10 place-items-center bg-[#5db8c5]/82 text-[10px] font-black text-slate-950"
          initial={{ width: 0 }}
          animate={{ width: `${long}%` }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          {longLabel} {long.toFixed(0)}%
        </motion.div>
        <motion.div
          className="grid min-w-10 place-items-center bg-[#c86d62]/84 text-[10px] font-black text-slate-950"
          initial={{ width: 0 }}
          animate={{ width: `${short}%` }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          {shortLabel} {short.toFixed(0)}%
        </motion.div>
      </div>
    </div>
  )
}
