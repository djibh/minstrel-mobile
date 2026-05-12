import { libraryApi } from '@/api/libraryApi';
import { mapAlbumDto } from '@/domain/mappers/album.mapper';
import { mapPlaylistDto } from '@/domain/mappers/playlist.mapper';
import { Album } from '@/domain/models/album.model';
import { usePlaybackActions } from '@/hooks/usePlaybackActions';
import { buildLocalAlbums } from '@/hooks/useOfflineScreen';
import { useOfflineStore } from '@/stores/offline.store';
import { usePlaybackStore } from '@/stores/playback.store';
import { routes } from '@/utils/routes';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

function mergeRecentAlbums(remoteAlbums: Album[], localAlbums: Album[]) {
    const merged = [...localAlbums, ...remoteAlbums];
    const seen = new Set<string>();

    return merged.filter((album) => {
        const key = `${album.sourceKind}:${album.title}:${album.artistName}`;
        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

export function useHomeScreen() {
    const router = useRouter();
    const playbackStore = usePlaybackStore();
    const localTracks = useOfflineStore((state) => state.localTracks);
    const { togglePlayPause } = usePlaybackActions();

    const [recentAlbums, setRecentAlbums] = useState<any[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setIsLoading(true);

            try {
                const localAlbums = buildLocalAlbums(localTracks);
                try {
                    const [albumsResult, playlistsResult] = await Promise.all([
                        libraryApi.getAlbums('all', 'alpha'),
                        libraryApi.getPlaylists('all', 'alpha'),
                    ]);

                    const mergedAlbums = mergeRecentAlbums(
                        albumsResult.map(mapAlbumDto),
                        localAlbums
                    );

                    setRecentAlbums(mergedAlbums.slice(0, 6));
                    setPlaylists(playlistsResult.map(mapPlaylistDto).slice(0, 4));
                } catch {
                    setRecentAlbums(localAlbums.slice(0, 6));
                    setPlaylists([]);
                }
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [localTracks]);

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
        openAlbum: (id: string) => router.push(routes.album(id)),
        openSearch: () => router.push('/(tabs)/search'),
        openPlaylist: (id: string) => router.push(routes.playlist(id)),
        resumePlayback: () => {
            if (!playbackStore.currentTrack) return;

            if (!playbackStore.isPlaying) {
                togglePlayPause();
            }

            router.push(routes.nowPlaying());
        },
        goToLibraryAlbums: () => router.push('/(tabs)/library'),
    };
}
