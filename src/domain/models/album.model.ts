export type Album = {
    id: string;
    sourceId: string;
    sourceKind: 'local' | 'pcloud';
    title: string;
    artistName: string;
    year?: number | null;
    trackCount: number;
    coverUrl?: string | null;
    isOfflineAvailable: boolean;
};