import { cn } from '../../lib/utils'

type GroupedTableHeaderProps = {
  title: string
  colSpan: number
  tone: 'output' | 'sentiment' | 'technical' | 'economic'
  stickyLeft?: boolean
}

const tones: Record<GroupedTableHeaderProps['tone'], string> = {
  output: 'from-slate-300/10 to-slate-400/5 text-slate-200',
  sentiment: 'from-cyan-300/12 to-cyan-400/5 text-cyan-100',
  technical: 'from-emerald-300/12 to-emerald-400/5 text-emerald-100',
  economic: 'from-amber-300/10 to-orange-400/5 text-amber-100',
}

export function GroupedTableHeader({ title, colSpan, tone, stickyLeft = false }: GroupedTableHeaderProps) {
  return (
    <th
      colSpan={colSpan}
      className={cn(
        'sticky top-0 z-30 border-b border-r border-white/10 bg-[#0b111a]/98 p-1.5 text-center backdrop-blur-xl',
        stickyLeft && 'left-0 z-40',
      )}
    >
      <div className={cn('rounded border border-white/10 bg-gradient-to-r px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em]', tones[tone])}>
        {title}
      </div>
    </th>
  )
}
