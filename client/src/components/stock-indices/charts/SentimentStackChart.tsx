import { BarChart2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { PanelShell } from '../PanelShell'
import type { SentimentBucket } from '../../../types/market'

type SentimentStackChartProps = {
  data: SentimentBucket[]
}

export function SentimentStackChart({ data }: SentimentStackChartProps) {
  return (
    <PanelShell title="Market Sentiment" eyebrow="Cohort stack" action={<BarChart2 className="h-4 w-4 text-slate-500" />}>
      <div className="grid h-[254px] grid-cols-4 items-end gap-3">
        {data.map((bucket) => (
          <div key={bucket.cohort} className="flex h-full min-w-0 flex-col justify-end gap-2">
            <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden rounded border border-white/10 bg-slate-950/55">
              {[
                { key: 'bullish', value: bucket.bullish, color: 'bg-[#48bccb]', label: 'Bullish' },
                { key: 'neutral', value: bucket.neutral, color: 'bg-[#566174]', label: 'Neutral' },
                { key: 'bearish', value: bucket.bearish, color: 'bg-[#c96d5a]', label: 'Bearish' },
              ].map((item) => (
                <motion.div
                  key={item.key}
                  className={`${item.color} grid min-h-5 place-items-center text-[10px] font-black text-slate-950`}
                  title={`${item.label}: ${item.value}%`}
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                >
                  {item.value}%
                </motion.div>
              ))}
            </div>
            <p className="min-h-8 text-center text-[10px] font-bold leading-tight text-slate-400">{bucket.cohort}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-bold text-slate-500">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#48bccb]" /> Bullish</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#566174]" /> Neutral</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#c96d5a]" /> Bearish</span>
      </div>
    </PanelShell>
  )
}
