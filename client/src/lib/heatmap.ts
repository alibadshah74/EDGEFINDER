import { clamp } from './utils'

export function heatmapClass(value: number, inverse = false) {
  const normalized = inverse ? -value : value

  if (normalized >= 2) {
    return 'border-cyan-300/35 bg-cyan-400/24 text-cyan-50 shadow-[inset_0_0_18px_rgba(34,211,238,0.12)]'
  }

  if (normalized === 1) {
    return 'border-teal-300/25 bg-teal-400/16 text-teal-50'
  }

  if (normalized <= -2) {
    return 'border-rose-300/35 bg-rose-500/26 text-rose-50 shadow-[inset_0_0_18px_rgba(244,63,94,0.12)]'
  }

  if (normalized === -1) {
    return 'border-amber-300/25 bg-amber-500/16 text-amber-50'
  }

  return 'border-white/8 bg-white/[0.045] text-slate-300'
}

export function scoreTone(score: number) {
  const bounded = clamp(score, -10, 10)

  if (bounded >= 6) return 'text-cyan-100 bg-cyan-400/18 border-cyan-300/25'
  if (bounded >= 2) return 'text-teal-100 bg-teal-400/14 border-teal-300/20'
  if (bounded <= -6) return 'text-rose-100 bg-rose-500/20 border-rose-300/25'
  if (bounded <= -2) return 'text-amber-100 bg-amber-500/15 border-amber-300/20'
  return 'text-slate-200 bg-white/[0.055] border-white/10'
}
