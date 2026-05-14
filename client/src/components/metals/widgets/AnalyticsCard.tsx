import type { ReactNode } from 'react'
import { cn } from '../../../lib/utils'

type AnalyticsCardProps = {
  title: string
  eyebrow?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function AnalyticsCard({ title, eyebrow, action, children, className }: AnalyticsCardProps) {
  return (
    <section className={cn('overflow-hidden rounded border border-slate-700/70 bg-[#0b1017]/92 shadow-xl shadow-black/20', className)}>
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-slate-700/70 bg-slate-800/24 px-3">
        <div className="min-w-0">
          {eyebrow && <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>}
          <h2 className="truncate text-xs font-black uppercase tracking-[0.13em] text-slate-100">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-3">{children}</div>
    </section>
  )
}
