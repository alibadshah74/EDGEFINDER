import { motion } from 'framer-motion'
import type { BiasLevel } from '../../../types/market'

type SentimentGaugeProps = {
  level: BiasLevel
  score: number
  confidence: number
}

const tone: Record<BiasLevel, { stroke: string; label: string }> = {
  'Very Bearish': { stroke: '#d06f61', label: 'Defensive pressure' },
  Bearish: { stroke: '#c98668', label: 'Macro headwind' },
  Neutral: { stroke: '#94a3b8', label: 'Two-way regime' },
  Bullish: { stroke: '#68c7d3', label: 'Constructive bias' },
  'Very Bullish': { stroke: '#7ad2bd', label: 'High-conviction bid' },
}

export function SentimentGauge({ level, score, confidence }: SentimentGaugeProps) {
  const radius = 56
  const arc = Math.PI * radius
  const progress = arc * (score / 100)
  const meta = tone[level]

  return (
    <div className="grid gap-3 sm:grid-cols-[156px_1fr] sm:items-center">
      <div className="relative mx-auto h-32 w-40">
        <svg viewBox="0 0 180 112" className="h-full w-full overflow-visible">
          <path d="M 34 90 A 56 56 0 0 1 146 90" fill="none" stroke="rgba(148,163,184,0.14)" strokeWidth="14" strokeLinecap="round" />
          <motion.path
            d="M 34 90 A 56 56 0 0 1 146 90"
            fill="none"
            stroke={meta.stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${arc}`}
            initial={{ strokeDasharray: `0 ${arc}` }}
            animate={{ strokeDasharray: `${progress} ${arc}` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <line x1="90" y1="90" x2={90 + Math.cos(Math.PI - Math.PI * (score / 100)) * 45} y2={90 - Math.sin(Math.PI * (score / 100)) * 45} stroke="#dbeafe" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="90" cy="90" r="5" fill="#dbeafe" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Bias</p>
          <p className="text-2xl font-black tabular-nums text-slate-50">{score}</p>
        </div>
      </div>
      <div className="min-w-0 space-y-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Institutional State</p>
          <p className="mt-1 text-2xl font-black text-slate-50" style={{ color: meta.stroke }}>{level}</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{meta.label}</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.035] p-2">
          <div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
            <span>Confidence</span>
            <span className="text-slate-200">{confidence}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-900">
            <motion.div className="h-full rounded-full bg-cyan-200/80" initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.65 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
