import { libraryApi } from '@/api/libraryApi';
import { mapAlbumDto } from '@/domain/mappers/album.mapper';
import { mapTrackDto } from '@/domain/mappers/track.mapper';
import { useLibraryStore } from '@/stores/library.store';
import { usePlaybackStore } from '@/stores/playback.store';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export function useLibraryScreen() {
    const router = useRouter();
    const playbackStore = usePlaybackStore();
    const {
        contentTab,
        sourceFilter,
        sortBy,
        setContentTab,
        setSourceFilter,
        setSortBy,
    } = useLibraryStore();

    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            try {
                if (contentTab === 'albums') {
                    const result = await libraryApi.getAlbums(sourceFilter, sortBy);
                    setItems(result.map(mapAlbumDto));
                } else if (contentTab === 'tracks') {
                    const result = await libraryApi.getTracks(sourceFilter, sortBy);
                    setItems(result.map(mapTrackDto));
                } else if (contentTab === 'artists') {
                    const result = await libraryApi.getArtists(sourceFilter, sortBy);
                    setItems(result);
                } else {
                    const result = await libraryApi.getPlaylists(sourceFilter, sortBy);
                    setItems(result);
                }
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [contentTab, sourceFilter, sortBy]);

    return {
        contentTab,
        sourceFilter,
        sortBy,
        items,
        isLoading,
        setContentTab,
        setSourceFilter,
        setSortBy,
        openAlbum: (id: string) => router.push(`/album/${id}`),
        playTrack: (track: any) => {
            playbackStore.setCurrentTrack(track);
            playbackStore.setIsPlaying(true);
            router.push('/now-playing');
        },
    };
}