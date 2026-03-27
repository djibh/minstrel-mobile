export type Playlist = {
    id: string;
    sourceId: string;
    sourceKind: 'local' | 'pcloud';
    name: string;
    coverUrl?: string | null;
    trackCount: number;
    isOfflineAvailable: boolean;
    subtitle: string;
};