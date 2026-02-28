import { create } from 'zustand';

import type { FarmFilters } from '../features/farms/types';

const defaultFilters: FarmFilters = {
  status: 'all',
  tipo: 'all',
  cidade: '',
};

type FarmFiltersState = {
  filters: FarmFilters;
  setFilters: (filters: FarmFilters) => void;
  resetFilters: () => void;
};

export const useFarmFiltersStore = create<FarmFiltersState>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: defaultFilters }),
}));

export { defaultFilters };
