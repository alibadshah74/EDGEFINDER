import { ChevronDown } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { cn } from '../../lib/utils'

type SelectProps<T extends string> = {
  label: string
  value: T
  options: T[]
  onChange: (value: T) => void
  className?: string
}

export function Select<T extends string>({ label, value, options, onChange, className }: SelectProps<T>) {
  return (
    <label className={cn('relative flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.055] px-3 py-2 text-sm text-slate-200 shadow-sm transition hover:border-cyan-300/30', className)}>
      <span className="hidden text-xs uppercase tracking-[0.14em] text-slate-500 md:inline">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value as T)}
        className="min-w-24 appearance-none bg-transparent pr-7 text-sm font-medium text-slate-100 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#10141d] text-slate-100">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500" aria-hidden="true" />
    </label>
  )
}
