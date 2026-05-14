import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, CandlestickChart, ChevronDown, CircleDollarSign, Factory, Gem, LineChart, Menu, Radar, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useDashboardStore } from '../../hooks/useDashboardStore'
import type { NavItem } from '../../types/market'

const mainItems: NavItem[] = [
  { label: 'Top Setups', icon: CandlestickChart },
  { label: 'EF Score Indicator', icon: ShieldCheck },
  { label: 'Gold & Silver', icon: Gem },
  { label: 'Stock Indices', icon: BarChart3 },
  { label: 'Forex', icon: CircleDollarSign },
  { label: 'Bonds', icon: LineChart }
  // { label: 'Market Sentiment', icon: Sparkles },
]

// const assetItems: NavItem[] = [
  
//   { label: 'Industrial Commodities', icon: Factory },
//   { label: 'Economic Data Index', icon: Radar },
// ]

// const analyticsItems = [
//   { label: 'Macro Scanners', icon: Radar },
//   { label: 'Signal Lab', icon: Sparkles },
// ]

export function Sidebar() {
  const { collapsed, setCollapsed, activeNav, setActiveNav } = useDashboardStore()
  const [assetOpen, setAssetOpen] = useState(true)

  const renderItem = (item: NavItem) => {
    const Icon = item.icon
    const active = activeNav === item.label

    return (
      <button
        key={item.label}
        type="button"
        title={collapsed ? item.label : undefined}
        onClick={() => setActiveNav(item.label)}
        className={cn(
          'group flex h-9 w-full items-center gap-2 rounded border px-2 text-left text-[11px] font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300/70',
          active
            ? 'border-cyan-300/25 bg-cyan-300/12 text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.10)]'
            : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/4.5 hover:text-slate-100',
          collapsed && 'justify-center px-0',
        )}
      >
        <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-cyan-200' : 'text-slate-500 group-hover:text-slate-200')} aria-hidden="true" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>
    )
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 54 : 196 }}
      transition={{ type: 'spring', stiffness: 260, damping: 32 }}
      className="fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/10 bg-[#090d13]/96 shadow-2xl shadow-black/35 backdrop-blur-xl"
    >
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-2.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.10)]">
          <span className="text-xs font-black">EF</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-[0.12em] text-slate-100">EdgeFinder Pro</p>
            <p className="truncate text-[10px] text-slate-500">Macro analytics</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-2 py-3" aria-label="Primary navigation">
        {mainItems.map(renderItem)}

        {/* <div className="my-3 border-t border-white/10" /> */}

        {/* {!collapsed && (
          <button
            type="button"
            onClick={() => setAssetOpen((open) => !open)}
            className="flex h-7 w-full items-center justify-between px-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600 outline-none transition hover:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            aria-expanded={assetOpen}
          >
            <span>Asset Sections</span>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', assetOpen && 'rotate-180')} aria-hidden="true" />
          </button>
        )} */}

        <AnimatePresence initial={false}>
          {(assetOpen || collapsed) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="space-y-1.5 overflow-hidden"
            >
              {/* {assetItems.map(renderItem)} */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* <div className="my-3 border-t border-white/10" /> */}

        {/* {!collapsed && (
          <div className="flex h-7 items-center justify-between px-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
            <span>Analytics</span>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
        )} */}

        {/* {analyticsItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              type="button"
              title={collapsed ? item.label : undefined}
              className={cn(
                'group flex h-9 w-full items-center gap-2 rounded border border-transparent px-2 text-left text-[11px] font-semibold text-slate-500 outline-none transition hover:border-white/10 hover:bg-white/[0.035] hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-cyan-300/70',
                collapsed && 'justify-center px-0',
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-slate-300" aria-hidden="true" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })} */}
      </nav>

      <div className="border-t border-white/10 p-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-9 w-full items-center justify-center gap-2 rounded border border-white/10 bg-white/4.5 text-[11px] font-bold text-slate-300 outline-none transition hover:border-cyan-300/25 hover:text-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  )
}
