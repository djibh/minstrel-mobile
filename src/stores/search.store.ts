import { create } from 'zustand';

type SearchStore = {
    query: string;
    setQuery: (value: string) => void;
    clearQuery: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
    query: '',
    setQuery: (query) => set({ query }),
    clearQuery: () => set({ query: '' }),
}));