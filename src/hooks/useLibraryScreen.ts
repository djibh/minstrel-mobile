import { libraryApi } from '@/api/libraryApi';
import { mapAlbumDto } from '@/domain/mappers/album.mapper';
import { mapArtistDto } from '@/domain/mappers/artist.mapper';
import { mapPlaylistDto } from '@/domain/mappers/playlist.mapper';
import { mapTrackDto } from '@/domain/mappers/track.mapper';
import { useLibraryStore } from '@/stores/library.store';
import { usePlaybackStore } from '@/stores/playback.store';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { LibraryItem } from '@/domain/models/library-item.model';
import { Track } from '@/domain/models/track.model';
import { routes } from '@/utils/routes';

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

    const [items, setItems] = useState<LibraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            setItems([]);

            try {
                if (contentTab === 'albums') {
                    const result = await libraryApi.getAlbums(sourceFilter, sortBy);
                    const mapped = result.map(mapAlbumDto);
                    setItems(mapped);
                    return;
                }

                if (contentTab === 'artists') {
                    const result = await libraryApi.getArtists(sourceFilter, sortBy);
                    const mapped = result.map(mapArtistDto);
                    setItems(mapped);
                    return;
                }

                if (contentTab === 'tracks') {
                    const result = await libraryApi.getTracks(sourceFilter, sortBy);
                    const mapped = result.map(mapTrackDto);
                    setItems(mapped);
                    return;
                }

                const result = await libraryApi.getPlaylists(sourceFilter, sortBy);
                const mapped = result.map(mapPlaylistDto);
                setItems(mapped);
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
        openAlbum: (id: string) => router.push(routes.album(id)),
        openArtist: (id: string) => {
            console.log('open artist', id);
        },
        openPlaylist: (id: string) => router.push(routes.playlist(id)),
        playTrack: (track: Track) => {
            const trackQueue = contentTab === 'tracks' ? items : [];
            playbackStore.setQueue(trackQueue as Track[]);
            playbackStore.setCurrentTrack(track);
            playbackStore.setIsPlaying(true);
            router.push(routes.nowPlaying());
        },
    };
}