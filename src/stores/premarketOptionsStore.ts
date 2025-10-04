import { create } from 'zustand';

export type PremarketSortOption = 
  | 'expiringSoon' 
  | 'expiringLater' 
  | 'alphabetical' 
  | 'liquidity' 
  | 'funding'
  | 'progress';

export type PremarketTimeFrameFilter = 'all' | '24h' | '7d' | '30d';
export type PremarketFundingFilter = 'any' | '1k' | '5k' | '10k';
export type PremarketProgressFilter = 'any' | '25' | '50' | '75';

interface PremarketOptionsState {
  selectedSort: PremarketSortOption;
  setSelectedSort: (sort: PremarketSortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  timeFrameFilter: PremarketTimeFrameFilter;
  setTimeFrameFilter: (filter: PremarketTimeFrameFilter) => void;
  
  fundingFilter: PremarketFundingFilter;
  setFundingFilter: (filter: PremarketFundingFilter) => void;
  
  progressFilter: PremarketProgressFilter;
  setProgressFilter: (filter: PremarketProgressFilter) => void;
  
  hideIlliquidMarkets: boolean;
  setHideIlliquidMarkets: (hide: boolean) => void;
  
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  
  lastUpdate: Date | null;
  setLastUpdate: (date: Date | null) => void;
}

export const usePremarketOptionsStore = create<PremarketOptionsState>((set) => ({
  // Default values
  selectedSort: 'funding',
  searchQuery: '',
  timeFrameFilter: 'all',
  fundingFilter: 'any',
  progressFilter: 'any',
  hideIlliquidMarkets: false,
  showAdvancedFilters: false,
  lastUpdate: null,
  
  // Actions
  setSelectedSort: (sort) => set({ selectedSort: sort }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTimeFrameFilter: (filter) => set({ timeFrameFilter: filter }),
  setFundingFilter: (filter) => set({ fundingFilter: filter }),
  setProgressFilter: (filter) => set({ progressFilter: filter }),
  setHideIlliquidMarkets: (hide) => set({ hideIlliquidMarkets: hide }),
  setShowAdvancedFilters: (show) => set({ showAdvancedFilters: show }),
  setLastUpdate: (date) => set({ lastUpdate: date }),
}));
