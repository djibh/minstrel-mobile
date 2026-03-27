import { libraryApi } from '@/api/libraryApi';
import { mapAlbumDto } from '@/domain/mappers/album.mapper';
import { mapPlaylistDto } from '@/domain/mappers/playlist.mapper';
import { usePlaybackStore } from '@/stores/playback.store';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

export function useHomeScreen() {
    const router = useRouter();
    const playbackStore = usePlaybackStore();

    const [recentAlbums, setRecentAlbums] = useState<any[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setIsLoading(true);

            try {
                const [albumsResult, playlistsResult] = await Promise.all([
                    libraryApi.getAlbums('all', 'alpha'),
                    libraryApi.getPlaylists('all', 'alpha'),
                ]);

                setRecentAlbums(albumsResult.map(mapAlbumDto).slice(0, 6));
                setPlaylists(playlistsResult.map(mapPlaylistDto).slice(0, 4));
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, []);

    const continueListening = useMemo(() => {
        if (!playbackStore.currentTrack) return null;

        return {
            title: playbackStore.currentTrack.title,
            subtitle: playbackStore.currentTrack.artistName,
            meta: playbackStore.currentTrack.albumTitle,
        };
    }, [playbackStore.currentTrack]);

    return {
        isLoading,
        recentAlbums,
        playlists,
        continueListening,
        openAlbum: (id: string) => router.push(`/album/${id}`),
        openSearch: () => router.push('/(tabs)/search'),
        resumePlayback: () => {
            if (!playbackStore.currentTrack) return;
            playbackStore.setIsPlaying(true);
            router.push('/now-playing');
        },
        goToLibraryAlbums: () => router.push('/(tabs)/library'),
    };
}