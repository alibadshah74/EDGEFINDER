import { Bell, Boxes, Search, UserRound } from 'lucide-react'
import { Select } from '../ui/Select'
import { useDashboardStore } from '../../hooks/useDashboardStore'
import type { AssetFilter, MarketBias, MarketCategory } from '../../types/market'

const assetFilters: AssetFilter[] = ['All Assets', 'Indices', 'Metals', 'FX Pairs', 'Rate Curves']
const categories: MarketCategory[] = ['All Markets', 'Equities', 'Metals', 'Currency', 'Rates']
const biases: Array<MarketBias | 'All Bias'> = ['All Bias', 'Very Bearish', 'Bearish', 'Neutral', 'Bullish', 'Very Bullish']

export function HeaderToolbar() {
  const { search, setSearch, assetFilter, setAssetFilter, category, setCategory, biasFilter, setBiasFilter } = useDashboardStore()

  return (
    <header className="sticky top-0 z-20 flex min-h-14 items-center gap-2 border-b border-white/10 bg-[#0b111a]/88 px-3 backdrop-blur-xl lg:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded border border-cyan-300/22 bg-cyan-300/10">
          <Boxes className="h-4 w-4 text-cyan-100" aria-hidden="true" />
        </div>
        <div className="hidden min-w-0 xl:block">
          <p className="truncate text-xs font-black uppercase tracking-[0.14em] text-slate-100">Market Intelligence Dashboard</p>
          <p className="truncate text-[10px] text-slate-500">Synthetic macro signal workspace</p>
        </div>
      </div>

      <div className="relative min-w-32 flex-1 xl:max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9 w-full rounded border border-white/10 bg-white/[0.052] pl-8 pr-2 text-xs font-semibold text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-white/16 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/15"
          placeholder="Search assets, bias, desk..."
          aria-label="Search assets"
        />
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Select label="Asset" value={assetFilter} options={assetFilters} onChange={setAssetFilter} />
        <Select label="Market" value={category} options={categories} onChange={setCategory} />
        <Select label="Bias" value={biasFilter} options={biases} onChange={setBiasFilter} />
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="grid h-9 w-9 place-items-center rounded border border-white/10 bg-white/[0.045] text-slate-300 transition hover:border-cyan-300/25 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded border border-white/10 bg-white/[0.045] text-slate-200 transition hover:border-teal-300/25 hover:text-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
        aria-label="User profile"
      >
        <UserRound className="h-4 w-4" aria-hidden="true" />
      </button>
    </header>
  )
}
