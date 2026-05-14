import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type PanelShellProps = {
  title: string
  eyebrow?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function PanelShell({ title, eyebrow, action, children, className }: PanelShellProps) {
  return (
    <section className={cn('overflow-hidden rounded border border-white/10 bg-[#0b1017]/88 shadow-xl shadow-black/20 backdrop-blur-xl', className)}>
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-3">
        <div className="min-w-0">
          {eyebrow && <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-200/65">{eyebrow}</p>}
          <h2 className="truncate text-xs font-black uppercase tracking-[0.13em] text-slate-100">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-3">{children}</div>
    </section>
  )
}
