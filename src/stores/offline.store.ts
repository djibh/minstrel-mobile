import { create } from 'zustand';

export type DownloadItem = {
    id: string;
    label: string;
    progress: number;
    state: 'queued' | 'running' | 'paused' | 'completed' | 'failed';
};

export type OfflineMediaItem = {
    id: string;
    type: 'album' | 'playlist' | 'track';
    title: string;
    subtitle: string;
};

export type LocalLibrarySummary = {
    trackCount: number;
    albumCount: number;
    artistCount: number;
    lastScanLabel: string;
    scanState: 'idle' | 'scanning' | 'ready';
};

export type PcloudConnection = {
    status: 'disconnected' | 'connected' | 'syncing';
    accountLabel?: string;
    libraryMode: 'browse' | 'import';
    syncedTrackCount: number;
};

export type ImportSourceItem = {
    id: string;
    kind: 'device' | 'folder' | 'pcloud';
    label: string;
    description: string;
    status: 'available' | 'connected' | 'attention';
    detail?: string;
};

type OfflineStore = {
    cacheUsedBytes: number;
    cacheMaxBytes: number;
    localLibrarySummary: LocalLibrarySummary;
    pcloudConnection: PcloudConnection;
    importSources: ImportSourceItem[];
    downloads: DownloadItem[];
    offlineItems: OfflineMediaItem[];

    setCacheUsedBytes: (value: number) => void;
    setCacheMaxBytes: (value: number) => void;
    setLocalLibrarySummary: (value: LocalLibrarySummary) => void;
    setPcloudConnection: (value: PcloudConnection) => void;
    setImportSources: (items: ImportSourceItem[]) => void;
    setDownloads: (downloads: DownloadItem[]) => void;
    setOfflineItems: (items: OfflineMediaItem[]) => void;
};

export const useOfflineStore = create<OfflineStore>((set) => ({
    cacheUsedBytes: 1.8 * 1024 * 1024 * 1024,
    cacheMaxBytes: 5 * 1024 * 1024 * 1024,
    localLibrarySummary: {
        trackCount: 148,
        albumCount: 17,
        artistCount: 12,
        lastScanLabel: 'Dernier scan il y a 8 min',
        scanState: 'ready',
    },
    pcloudConnection: {
        status: 'connected',
        accountLabel: 'djibh@pcloud.test',
        libraryMode: 'import',
        syncedTrackCount: 86,
    },
    importSources: [
        {
            id: 'device-storage',
            kind: 'device',
            label: 'Stockage de l’appareil',
            description: 'Scanner les morceaux audio deja presents localement.',
            status: 'available',
            detail: 'Acces local pret',
        },
        {
            id: 'app-import-folder',
            kind: 'folder',
            label: 'Dossier d’import Minstrel',
            description: 'Ajouter des fichiers a importer dans la bibliotheque.',
            status: 'available',
            detail: '3 ajouts recents',
        },
        {
            id: 'pcloud-source',
            kind: 'pcloud',
            label: 'pCloud',
            description: 'Connecter, parcourir et importer depuis le cloud.',
            status: 'connected',
            detail: 'Compte connecte',
        },
    ],

    downloads: [
        {
            id: 'download-1',
            label: 'Import pCloud · Midnight Echoes',
            progress: 45,
            state: 'running',
        },
        {
            id: 'download-2',
            label: 'Playlist Offline Mix',
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
        {
            id: 'offline-track-1',
            type: 'track',
            title: 'Electric Harbor',
            subtitle: 'Lena Vale',
        },
    ],

    setCacheUsedBytes: (cacheUsedBytes) => set({ cacheUsedBytes }),
    setCacheMaxBytes: (cacheMaxBytes) => set({ cacheMaxBytes }),
    setLocalLibrarySummary: (localLibrarySummary) => set({ localLibrarySummary }),
    setPcloudConnection: (pcloudConnection) => set({ pcloudConnection }),
    setImportSources: (importSources) => set({ importSources }),
    setDownloads: (downloads) => set({ downloads }),
    setOfflineItems: (offlineItems) => set({ offlineItems }),
}));
