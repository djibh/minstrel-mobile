export type TrackDto = {
    id: string;
    sourceId: string;
    sourceKind: 'local' | 'pcloud';
    title: string;
    artistName: string;
    albumTitle: string;
    durationSeconds?: number;
    coverUrl?: string | null;
    isOfflineAvailable: boolean;
};