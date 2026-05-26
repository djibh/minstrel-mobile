import { Track } from '@/domain/models/track.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
    sourceLabel?: string;
    track?: Track;
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

export type PendingImportAsset = {
    id: string;
    name: string;
    uri: string;
    size?: number | null;
    title: string;
    artistName: string;
    albumTitle: string;
    coverUrl?: string | null;
};

type OfflineStore = {
    cacheUsedBytes: number;
    cacheMaxBytes: number;
    localLibrarySummary: LocalLibrarySummary;
    pcloudConnection: PcloudConnection;
    importSources: ImportSourceItem[];
    downloads: DownloadItem[];
    offlineItems: OfflineMediaItem[];
    localTracks: Track[];
    pendingImportAssets: PendingImportAsset[];

    setCacheUsedBytes: (value: number) => void;
    setCacheMaxBytes: (value: number) => void;
    setLocalLibrarySummary: (value: LocalLibrarySummary) => void;
    setPcloudConnection: (value: PcloudConnection) => void;
    setImportSources: (items: ImportSourceItem[]) => void;
    setDownloads: (downloads: DownloadItem[]) => void;
    setOfflineItems: (items: OfflineMediaItem[]) => void;
    setLocalTracks: (tracks: Track[]) => void;
    setPendingImportAssets: (assets: PendingImportAsset[]) => void;
};

export const useOfflineStore = create<OfflineStore>()(
    persist(
        (set) => ({
    cacheUsedBytes: 0,
    cacheMaxBytes: 5 * 1024 * 1024 * 1024,
    localLibrarySummary: {
        trackCount: 0,
        albumCount: 0,
        artistCount: 0,
        lastScanLabel: "Aucun fichier local importe",
        scanState: "idle",
    },
    pcloudConnection: {
        status: "disconnected",
        libraryMode: "import",
        syncedTrackCount: 0,
    },
    importSources: [
        {
            id: "device-storage",
            kind: "device",
            label: "Stockage de l’appareil",
            description: "Scanner les morceaux audio deja presents localement.",
            status: "available",
            detail: "Choisir des fichiers audio",
        },
        {
            id: "app-import-folder",
            kind: "folder",
            label: "Dossier d’import Minstrel",
            description: "Ajouter des fichiers a importer dans la bibliotheque.",
            status: "available",
            detail: "Selection manuelle de fichiers",
        },
        {
            id: "pcloud-source",
            kind: "pcloud",
            label: "pCloud",
            description: "Connecter, parcourir et importer depuis le cloud.",
            status: "available",
            detail: "Non configure",
        },
    ],

    downloads: [],

    offlineItems: [],
    localTracks: [],
    pendingImportAssets: [],

    setCacheUsedBytes: (cacheUsedBytes) => set({ cacheUsedBytes }),
    setCacheMaxBytes: (cacheMaxBytes) => set({ cacheMaxBytes }),
    setLocalLibrarySummary: (localLibrarySummary) => set({ localLibrarySummary }),
    setPcloudConnection: (pcloudConnection) => set({ pcloudConnection }),
    setImportSources: (importSources) => set({ importSources }),
    setDownloads: (downloads) => set({ downloads }),
    setOfflineItems: (offlineItems) => set({ offlineItems }),
    setLocalTracks: (localTracks) => set({ localTracks }),
    setPendingImportAssets: (pendingImportAssets) => set({ pendingImportAssets }),
        }),
        {
            name: 'minstrel-offline-store',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                localTracks: state.localTracks,
                offlineItems: state.offlineItems,
                localLibrarySummary: state.localLibrarySummary,
            }),
        }
    )
);
