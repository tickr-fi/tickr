import { create } from 'zustand';

interface GlobalLoadingState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useGlobalLoadingStore = create<GlobalLoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
