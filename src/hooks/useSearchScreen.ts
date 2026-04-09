import { searchApi } from '@/api/searchApi';
import { mapAlbumDto } from '@/domain/mappers/album.mapper';
import { mapArtistDto } from '@/domain/mappers/artist.mapper';
import { mapPlaylistDto } from '@/domain/mappers/playlist.mapper';
import { mapTrackDto } from '@/domain/mappers/track.mapper';
import { Track } from '@/domain/models/track.model';
import { usePlaybackActions } from '@/hooks/usePlaybackActions';
import { useSearchStore } from '@/stores/search.store';
import { routes } from '@/utils/routes';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

export function useSearchScreen() {
    const router = useRouter();
    const { query, setQuery, clearQuery } = useSearchStore();
    const { playTrack: playTrackAction } = usePlaybackActions();

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{
        tracks: Track[];
        albums: any[];
        artists: any[];
        playlists: any[];
    }>({
        tracks: [],
        albums: [],
        artists: [],
        playlists: [],
    });

    useEffect(() => {
        if (!query.trim()) {
            setResults({
                tracks: [],
                albums: [],
                artists: [],
                playlists: [],
            });
            return;
        }

        const timeout = setTimeout(async () => {
            setIsLoading(true);

            try {
                const response = await searchApi.search(query);

                setResults({
                    tracks: response.tracks.map(mapTrackDto),
                    albums: response.albums.map(mapAlbumDto),
                    artists: response.artists.map(mapArtistDto),
                    playlists: response.playlists.map(mapPlaylistDto),
                });
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    const hasResults = useMemo(() => {
        return (
            results.tracks.length > 0 ||
            results.albums.length > 0 ||
            results.artists.length > 0 ||
            results.playlists.length > 0
        );
    }, [results]);

    const playTrack = async (track: Track) => {
        await playTrackAction(track, results.tracks);
        router.push(routes.nowPlaying());
    };

    return {
        query,
        setQuery,
        clearQuery,
        isLoading,
        results,
        hasResults,
        playTrack,
        openAlbum: (id: string) => router.push(routes.album(id)),
        openArtist: (id: string) => console.log('open artist', id),
        openPlaylist: (id: string) => router.push(routes.playlist(id)),
    };
}
