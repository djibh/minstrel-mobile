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
    streamUri?: string | null;
    coverUrl?: string | null;
    isOfflineAvailable: boolean;
};
