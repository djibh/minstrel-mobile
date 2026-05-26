import { libraryApi } from '@/api/libraryApi';
import { mapPlaylistDto } from '@/domain/mappers/playlist.mapper';
import { mapTrackDto } from '@/domain/mappers/track.mapper';
import { usePlaybackStore } from '@/stores/playback.store';
import { routes } from '@/utils/routes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { usePlaybackActions } from './usePlaybackActions';

export function usePlaylistDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { playTrack: playTrackAction } = usePlaybackActions();

    const [playlist, setPlaylist] = useState<any | null>(null);
    const [tracks, setTracks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function load() {
            if (!id) return;

            setIsLoading(true);

            try {
                const [playlistsResult, tracksResult] = await Promise.all([
                    libraryApi.getPlaylists('all', 'alpha'),
                    libraryApi.getTracks('all', 'alpha'),
                ]);

                const mappedPlaylists = playlistsResult.map(mapPlaylistDto);
                const foundPlaylist = mappedPlaylists.find((x) => x.id === id) ?? null;

                const mappedTracks = tracksResult.map(mapTrackDto);

                // MVP temporaire :
                // on prend les premiers morceaux disponibles pour illustrer le détail playlist.
                const playlistTracks = foundPlaylist
                    ? mappedTracks.slice(0, foundPlaylist.trackCount || 10)
                    : [];

                setPlaylist(foundPlaylist);
                setTracks(playlistTracks);
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [id]);

    const playlistMeta = useMemo(() => {
        if (!playlist) return '';

        const parts = [
            playlist.trackCount ? `${playlist.trackCount} morceaux` : null,
            playlist.isOfflineAvailable ? 'Disponible hors ligne' : null,
        ].filter(Boolean);

        return parts.join(' • ');
    }, [playlist]);

    const playPlaylist = async () => {
        if (!tracks.length) return;

        usePlaybackStore.getState().setShuffleEnabled(false);
        await playTrackAction(tracks[0], tracks);
        router.push(routes.nowPlaying());
    };

    const shufflePlaylist = async () => {
        if (!tracks.length) return;

        usePlaybackStore.getState().setShuffleEnabled(true);
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        await playTrackAction(randomTrack, tracks);
        router.push(routes.nowPlaying());
    };

    const playTrack = async (track: any) => {
        await playTrackAction(track, tracks);
        router.push(routes.nowPlaying());
    };

    return {
        playlist,
        tracks,
        isLoading,
        playlistMeta,
        playPlaylist,
        shufflePlaylist,
        playTrack,
    };
}