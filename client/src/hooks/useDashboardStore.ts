import { create } from 'zustand'
import type { AssetFilter, MarketBias, MarketCategory } from '../types/market'

type DashboardState = {
  collapsed: boolean
  search: string
  assetFilter: AssetFilter
  category: MarketCategory
  biasFilter: MarketBias | 'All Bias'
  activeNav: string
  setCollapsed: (collapsed: boolean) => void
  setSearch: (search: string) => void
  setAssetFilter: (assetFilter: AssetFilter) => void
  setCategory: (category: MarketCategory) => void
  setBiasFilter: (biasFilter: MarketBias | 'All Bias') => void
  setActiveNav: (activeNav: string) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  collapsed: false,
  search: '',
  assetFilter: 'All Assets',
  category: 'All Markets',
  biasFilter: 'All Bias',
  activeNav: 'Top Setups',
  setCollapsed: (collapsed) => set({ collapsed }),
  setSearch: (search) => set({ search }),
  setAssetFilter: (assetFilter) => set({ assetFilter }),
  setCategory: (category) => set({ category }),
  setBiasFilter: (biasFilter) => set({ biasFilter }),
  setActiveNav: (activeNav) => set({ activeNav }),
}))
