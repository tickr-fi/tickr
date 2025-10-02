import { create } from 'zustand';

export type SortOption = 'expiringSoon' | 'expiringLater' | 'alphabetical' | 'highestLiquidity' | 'highestVolume';
export type StatusFilter = 'ACTIVE' | 'RESOLVED' | 'ALL';
export type OptionsViewMode = 'odds' | 'prices';
export type ViewMode = 'table' | 'cards' | 'grid';
export type TimeFrameFilter = 'all' | '24h' | '7d' | '30d';
export type LiquidityFilter = 'any' | '10k' | '50k' | '100k';
export type VolumeFilter = 'any' | '2_5k' | '5k' | '10k';

// Grid filter types
export type GridTimeFilter = '<1h' | '<24h' | '<7d' | '<30d' | 'All';
export type GridOptionsFilter = 'BOTH' | 'YES' | 'NO' | 'WINNER';

interface MarketOptionsState {
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
  
  volumeFilter: VolumeFilter;
  setVolumeFilter: (filter: VolumeFilter) => void;
  
  hideIlliquidMarkets: boolean;
  setHideIlliquidMarkets: (hide: boolean) => void;
  
  showMovers10Percent: boolean;
  setShowMovers10Percent: (show: boolean) => void;
  
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  
  lastUpdate: Date | null;
  setLastUpdate: (date: Date | null) => void;
  
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  
  // Grid filter states
  gridTimeFilter: GridTimeFilter;
  setGridTimeFilter: (filter: GridTimeFilter) => void;
  
  gridOptionsFilter: GridOptionsFilter;
  setGridOptionsFilter: (filter: GridOptionsFilter) => void;
}

export const useMarketOptionsStore = create<MarketOptionsState>()((set) => ({
  // Default values
  selectedSort: 'expiringSoon',
  statusFilter: 'ACTIVE',
  optionsViewMode: 'odds',
  viewMode: 'table',
  searchQuery: '',
  timeFrameFilter: 'all',
  liquidityFilter: 'any',
  volumeFilter: 'any',
  hideIlliquidMarkets: false,
  showMovers10Percent: false,
  showAdvancedFilters: false,
  lastUpdate: null,
  showMobileMenu: false,
  
  // Grid filter defaults
  gridTimeFilter: 'All',
  gridOptionsFilter: 'BOTH',
  
  // Actions
  setSelectedSort: (sort) => set({ selectedSort: sort }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setOptionsViewMode: (mode) => set({ optionsViewMode: mode }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTimeFrameFilter: (filter) => set({ timeFrameFilter: filter }),
  setLiquidityFilter: (filter) => set({ liquidityFilter: filter }),
  setVolumeFilter: (filter) => set({ volumeFilter: filter }),
  setHideIlliquidMarkets: (hide) => set({ hideIlliquidMarkets: hide }),
  setShowMovers10Percent: (show) => set({ showMovers10Percent: show }),
  setShowAdvancedFilters: (show) => set({ showAdvancedFilters: show }),
  setLastUpdate: (date) => set({ lastUpdate: date }),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  
  // Grid filter actions
  setGridTimeFilter: (filter) => set({ gridTimeFilter: filter }),
  setGridOptionsFilter: (filter) => set({ gridOptionsFilter: filter }),
}));
