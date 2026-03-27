import { create } from 'zustand';

export type DownloadItem = {
    id: string;
    label: string;
    progress: number;
    state: 'queued' | 'running' | 'paused' | 'completed' | 'failed';
};

export type OfflineMediaItem = {
    id: string;
    type: 'album' | 'playlist';
    title: string;
    subtitle: string;
};

type OfflineStore = {
    cacheUsedBytes: number;
    cacheMaxBytes: number;
    downloads: DownloadItem[];
    offlineItems: OfflineMediaItem[];

    setCacheUsedBytes: (value: number) => void;
    setCacheMaxBytes: (value: number) => void;
    setDownloads: (downloads: DownloadItem[]) => void;
    setOfflineItems: (items: OfflineMediaItem[]) => void;
};

export const useOfflineStore = create<OfflineStore>((set) => ({
    cacheUsedBytes: 1.8 * 1024 * 1024 * 1024,
    cacheMaxBytes: 5 * 1024 * 1024 * 1024,

    downloads: [
        {
            id: 'download-1',
            label: 'Midnight Echoes',
            progress: 45,
            state: 'running',
        },
        {
            id: 'download-2',
            label: 'Offline Mix',
            progress: 82,
            state: 'running',
        },
    ],

    offlineItems: [
        {
            id: 'offline-album-1',
            type: 'album',
            title: 'Blue Static',
            subtitle: 'Kara North',
        },
        {
            id: 'offline-playlist-1',
            type: 'playlist',
            title: 'Offline Mix',
            subtitle: '9 morceaux',
        },
    ],

    setCacheUsedBytes: (cacheUsedBytes) => set({ cacheUsedBytes }),
    setCacheMaxBytes: (cacheMaxBytes) => set({ cacheMaxBytes }),
    setDownloads: (downloads) => set({ downloads }),
    setOfflineItems: (offlineItems) => set({ offlineItems }),
}));