import { create } from 'zustand';

export type LibraryContentTab = 'albums' | 'artists' | 'tracks' | 'playlists';
export type SourceFilter = 'all' | 'local' | 'pcloud' | 'downloaded';
export type LibrarySort = 'recent' | 'alpha' | 'alpha-desc' | 'artist' | 'year';

type LibraryStore = {
    contentTab: LibraryContentTab;
    sourceFilter: SourceFilter;
    sortBy: LibrarySort;
    setContentTab: (tab: LibraryContentTab) => void;
    setSourceFilter: (filter: SourceFilter) => void;
    setSortBy: (sort: LibrarySort) => void;
};

export const useLibraryStore = create<LibraryStore>((set) => ({
    contentTab: 'albums',
    sourceFilter: 'all',
    sortBy: 'recent',
    setContentTab: (contentTab) => set({ contentTab }),
    setSourceFilter: (sourceFilter) => set({ sourceFilter }),
    setSortBy: (sortBy) => set({ sortBy }),
}));