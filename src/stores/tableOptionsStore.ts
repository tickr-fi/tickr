import { create } from 'zustand';

export type SortOption = 'expiringSoon' | 'expiringLater' | 'alphabetical' | 'highestLiquidity';
export type StatusFilter = 'ACTIVE' | 'RESOLVED' | 'ALL';
export type OptionsViewMode = 'odds' | 'prices';
export type ViewMode = 'table' | 'cards';
export type TimeFrameFilter = 'all' | '24h' | '7d' | '30d';
export type LiquidityFilter = 'any' | '10k' | '50k' | '100k';

interface TableOptionsState {
  selectedSort: SortOption;
  setSelectedSort: (sort: SortOption) => void;
  
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  
  optionsViewMode: OptionsViewMode;
  setOptionsViewMode: (mode: OptionsViewMode) => void;
  
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  timeFrameFilter: TimeFrameFilter;
  setTimeFrameFilter: (filter: TimeFrameFilter) => void;
  
  liquidityFilter: LiquidityFilter;
  setLiquidityFilter: (filter: LiquidityFilter) => void;
  
  hideIlliquidMarkets: boolean;
  setHideIlliquidMarkets: (hide: boolean) => void;
  
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  
  lastUpdate: Date | null;
  setLastUpdate: (date: Date | null) => void;
}

export const useTableOptionsStore = create<TableOptionsState>()((set) => ({
  // Default values
  selectedSort: 'expiringSoon',
  statusFilter: 'ACTIVE',
  optionsViewMode: 'odds',
  viewMode: 'table',
  searchQuery: '',
  timeFrameFilter: 'all',
  liquidityFilter: 'any',
  hideIlliquidMarkets: false,
  showAdvancedFilters: false,
  lastUpdate: null,
  
  // Actions
  setSelectedSort: (sort) => set({ selectedSort: sort }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setOptionsViewMode: (mode) => set({ optionsViewMode: mode }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTimeFrameFilter: (filter) => set({ timeFrameFilter: filter }),
  setLiquidityFilter: (filter) => set({ liquidityFilter: filter }),
  setHideIlliquidMarkets: (hide) => set({ hideIlliquidMarkets: hide }),
  setShowAdvancedFilters: (show) => set({ showAdvancedFilters: show }),
  setLastUpdate: (date) => set({ lastUpdate: date }),
}));
