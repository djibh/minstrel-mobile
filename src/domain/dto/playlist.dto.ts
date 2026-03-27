export type PlaylistDto = {
    id: string;
    sourceId: string;
    sourceKind: 'local' | 'pcloud';
    name: string;
    coverUrl?: string | null;
    trackCount: number;
    isOfflineAvailable: boolean;
};