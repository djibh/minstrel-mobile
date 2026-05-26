import { libraryApi } from '@/api/libraryApi';
import { mapAlbumDto } from '@/domain/mappers/album.mapper';
import { mapArtistDto } from '@/domain/mappers/artist.mapper';
import { mapTrackDto } from '@/domain/mappers/track.mapper';
import { Album } from '@/domain/models/album.model';
import { Artist } from '@/domain/models/artist.model';
import { Track } from '@/domain/models/track.model';
import { usePlaybackStore } from '@/stores/playback.store';
import { routes } from '@/utils/routes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { usePlaybackActions } from './usePlaybackActions';

export function useArtistDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { playTrack: playTrackAction } = usePlaybackActions();

    const [artist, setArtist] = useState<Artist | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function load() {
            if (!id) return;

            setIsLoading(true);

            try {
                const [artistsResult, albumsResult, tracksResult] = await Promise.all([
                    libraryApi.getArtists('all', 'alpha'),
                    libraryApi.getAlbums('all', 'alpha'),
                    libraryApi.getTracks('all', 'alpha'),
                ]);

                const mappedArtists = artistsResult.map(mapArtistDto);
                const foundArtist = mappedArtists.find((x) => x.id === id) ?? null;

                if (foundArtist) {
                    const mappedAlbums = albumsResult
                        .map(mapAlbumDto)
                        .filter((x) => x.artistName === foundArtist.name);

                    const mappedTracks = tracksResult
                        .map(mapTrackDto)
                        .filter((x) => x.artistName === foundArtist.name);

                    setAlbums(mappedAlbums);
                    setTracks(mappedTracks);
                }

                setArtist(foundArtist);
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [id]);

    const playAll = async () => {
        if (!tracks.length) return;

        usePlaybackStore.getState().setShuffleEnabled(false);
        await playTrackAction(tracks[0], tracks);
        router.push(routes.nowPlaying());
    };

    const shuffleAll = async () => {
        if (!tracks.length) return;

        usePlaybackStore.getState().setShuffleEnabled(true);
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        await playTrackAction(randomTrack, tracks);
        router.push(routes.nowPlaying());
    };

    const playTrack = async (track: Track) => {
        await playTrackAction(track, tracks);
        router.push(routes.nowPlaying());
    };

    const openAlbum = (albumId: string) => router.push(routes.album(albumId));

    return {
        artist,
        albums,
        tracks,
        isLoading,
        playAll,
        shuffleAll,
        playTrack,
        openAlbum,
    };
}
