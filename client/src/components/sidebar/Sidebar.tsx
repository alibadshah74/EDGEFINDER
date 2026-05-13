import { BarChart3, CandlestickChart, CircleDollarSign, Gem, LineChart, Menu, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useDashboardStore } from '../../hooks/useDashboardStore'
import type { NavItem } from '../../types/market'

const navItems: NavItem[] = [
  { label: 'Top Setups', icon: CandlestickChart },
  { label: 'EF Score Indicator', icon: ShieldCheck },
  { label: 'Stock Indicator', icon: BarChart3 },
  { label: 'Gold & Silver', icon: Gem },
  { label: 'Forex', icon: CircleDollarSign },
  { label: 'Bonds', icon: LineChart },
]

export function Sidebar() {
  const { collapsed, setCollapsed, activeNav, setActiveNav } = useDashboardStore()

  return (
    <motion.aside
      animate={{ width: collapsed ? 54 : 196 }}
      transition={{ type: 'spring', stiffness: 260, damping: 32 }}
      className="fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/10 bg-[#0a0e15]/96 shadow-2xl shadow-black/35 backdrop-blur-xl"
    >
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-2.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.10)]">
          <span className="text-xs font-black">M</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-[0.12em] text-slate-100">Market Intel</p>
            <p className="truncate text-[10px] text-slate-500">Quant terminal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 px-2 py-3" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = activeNav === item.label

          return (
            <button
              key={item.label}
              type="button"
              title={collapsed ? item.label : undefined}
              onClick={() => setActiveNav(item.label)}
              className={cn(
                'group flex h-11 w-full items-center gap-3 rounded-md border px-3 text-left text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300/70',
                'h-9 gap-2 rounded px-2 text-[11px]',
                active
                  ? 'border-cyan-300/25 bg-cyan-300/12 text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.10)]'
                  : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.045] hover:text-slate-100',
                collapsed && 'justify-center px-0',
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-cyan-200' : 'text-slate-500 group-hover:text-slate-200')} aria-hidden="true" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-9 w-full items-center justify-center gap-2 rounded border border-white/10 bg-white/[0.045] text-[11px] font-bold text-slate-300 outline-none transition hover:border-cyan-300/25 hover:text-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  )
}
