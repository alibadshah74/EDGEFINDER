import { motion } from 'framer-motion'
import { GaugeCircle } from 'lucide-react'
import { PanelShell } from '../PanelShell'
import type { BiasLevel } from '../../../types/market'

type MarketBiasGaugeProps = {
  level: BiasLevel
  score: number
  confidence: number
}

const levelMeta: Record<BiasLevel, { color: string; accent: string }> = {
  'Very Bearish': { color: '#de765e', accent: 'Risk compression' },
  Bearish: { color: '#c98263', accent: 'Defensive skew' },
  Neutral: { color: '#94a3b8', accent: 'Balanced tape' },
  Bullish: { color: '#55c7d3', accent: 'Constructive flow' },
  'Very Bullish': { color: '#4dd4b0', accent: 'High conviction' },
}

export function MarketBiasGauge({ level, score, confidence }: MarketBiasGaugeProps) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const progress = circumference * (score / 100)
  const meta = levelMeta[level]

  return (
    <PanelShell title="Market Bias" eyebrow="Composite regime" action={<GaugeCircle className="h-4 w-4 text-slate-500" />}>
      <div className="grid items-center gap-4 sm:grid-cols-[150px_1fr]">
        <div className="relative mx-auto grid h-36 w-36 place-items-center">
          <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(148,163,184,0.11)" strokeWidth="12" />
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={meta.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${progress} ${circumference}` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
            <circle cx="70" cy="70" r="36" fill="rgba(8,12,18,0.94)" stroke="rgba(255,255,255,0.08)" />
          </svg>
          <div className="absolute text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Score</p>
            <p className="text-3xl font-black tabular-nums text-slate-50">{score}</p>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Current State</p>
            <p className="mt-1 text-2xl font-black text-slate-50" style={{ color: meta.color }}>
              {level}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-400">{meta.accent}</p>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {(['Very Bearish', 'Bearish', 'Neutral', 'Bullish', 'Very Bullish'] as BiasLevel[]).map((item) => (
              <div key={item} className="h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: item === level ? '100%' : '0%', background: levelMeta[item].color }} />
              </div>
            ))}
          </div>
          <div className="rounded border border-white/10 bg-white/[0.035] p-2">
            <div className="mb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <span>Model Confidence</span>
              <span className="text-slate-200">{confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800">
              <motion.div className="h-full rounded-full bg-cyan-300/80" initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.7 }} />
            </div>
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
