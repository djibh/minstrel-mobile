export type Track = {
    id: string;
    sourceId: string;
    sourceKind: 'local' | 'pcloud';
    title: string;
    artistName: string;
    albumTitle: string;
    subtitle: string;
    durationSeconds?: number;
    durationLabel: string;
    coverUrl?: string | null;
    isOfflineAvailable: boolean;
};