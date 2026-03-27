import { libraryApi } from '@/api/libraryApi';
import { mapAlbumDto } from '@/domain/mappers/album.mapper';
import { mapTrackDto } from '@/domain/mappers/track.mapper';
import { usePlaybackStore } from '@/stores/playback.store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

export function useAlbumDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const playbackStore = usePlaybackStore();

    const [album, setAlbum] = useState<any | null>(null);
    const [tracks, setTracks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function load() {
            if (!id) return;

            setIsLoading(true);

            try {
                const [albumsResult, tracksResult] = await Promise.all([
                    libraryApi.getAlbums('all', 'alpha'),
                    libraryApi.getTracks('all', 'alpha'),
                ]);

                const mappedAlbums = albumsResult.map(mapAlbumDto);
                const foundAlbum = mappedAlbums.find((x) => x.id === id) ?? null;

                const mappedTracks = tracksResult.map(mapTrackDto);

                const albumTracks = foundAlbum
                    ? mappedTracks.filter((x) => x.albumTitle === foundAlbum.title)
                    : [];

                setAlbum(foundAlbum);
                setTracks(albumTracks);
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [id]);

    const albumMeta = useMemo(() => {
        if (!album) return '';

        const parts = [
            album.year ? String(album.year) : null,
            album.trackCount ? `${album.trackCount} morceaux` : null,
        ].filter(Boolean);

        return parts.join(' • ');
    }, [album]);

    const playAlbum = () => {
        if (!tracks.length) return;

        playbackStore.setQueue(tracks);
        playbackStore.setCurrentTrack(tracks[0]);
        playbackStore.setIsPlaying(true);
        router.push('/now-playing');
    };

    const playTrack = (track: any) => {
        playbackStore.setQueue(tracks);
        playbackStore.setCurrentTrack(track);
        playbackStore.setIsPlaying(true);
        router.push('/now-playing');
    };

    return {
        album,
        tracks,
        isLoading,
        albumMeta,
        playAlbum,
        playTrack,
    };
}