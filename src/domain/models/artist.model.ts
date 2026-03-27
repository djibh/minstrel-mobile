export type Artist = {
    id: string;
    sourceId: string;
    sourceKind: 'local' | 'pcloud';
    name: string;
    imageUrl?: string | null;
    albumCount: number;
    trackCount: number;
    subtitle: string;
};