import { libraryApi } from '@/api/libraryApi';
import { mapAlbumDto } from '@/domain/mappers/album.mapper';
import { mapArtistDto } from '@/domain/mappers/artist.mapper';
import { mapPlaylistDto } from '@/domain/mappers/playlist.mapper';
import { mapTrackDto } from '@/domain/mappers/track.mapper';
import { Album } from '@/domain/models/album.model';
import { Artist } from '@/domain/models/artist.model';
import { useLibraryStore } from '@/stores/library.store';
import { useOfflineStore } from '@/stores/offline.store';
import { usePlaybackStore } from '@/stores/playback.store';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { LibraryItem } from '@/domain/models/library-item.model';
import { Track } from '@/domain/models/track.model';
import { usePlaybackActions } from '@/hooks/usePlaybackActions';
import { buildLocalAlbums, buildLocalArtists } from '@/hooks/useOfflineScreen';
import { routes } from '@/utils/routes';

function sortTracks(tracks: Track[], sortBy: 'alpha' | 'artist' | 'year' | 'recent') {
    if (sortBy === 'artist') {
        return [...tracks].sort((a, b) => a.artistName.localeCompare(b.artistName));
    }

    if (sortBy === 'recent') {
        return [...tracks].reverse();
    }

    return [...tracks].sort((a, b) => a.title.localeCompare(b.title));
}

function sortAlbums(albums: Album[], sortBy: 'alpha' | 'artist' | 'year' | 'recent') {
    if (sortBy === 'artist') {
        return [...albums].sort((a, b) => a.artistName.localeCompare(b.artistName));
    }

    if (sortBy === 'year') {
        return [...albums].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    }

    if (sortBy === 'recent') {
        return [...albums].reverse();
    }

    return [...albums].sort((a, b) => a.title.localeCompare(b.title));
}

function sortArtists(artists: Artist[], sortBy: 'alpha' | 'artist' | 'year' | 'recent') {
    if (sortBy === 'recent') {
        return [...artists].reverse();
    }

    return [...artists].sort((a, b) => a.name.localeCompare(b.name));
}

function mergeLibraryItems<T extends LibraryItem>(
    remoteItems: T[],
    localItems: T[],
    sourceFilter: 'all' | 'local' | 'pcloud' | 'downloaded'
) {
    if (sourceFilter === 'local' || sourceFilter === 'downloaded') {
        return localItems;
    }

    if (sourceFilter === 'pcloud') {
        return remoteItems;
    }

    return [...localItems, ...remoteItems];
}

export function useLibraryScreen() {
    const router = useRouter();
    const playbackStore = usePlaybackStore();
    const localTracks = useOfflineStore((state) => state.localTracks);
    const { playTrack: playTrackAction } = usePlaybackActions();

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
            const localAlbums = buildLocalAlbums(localTracks);
            const localArtists = buildLocalArtists(localTracks);
            const fallbackTracks = sortTracks(localTracks, sortBy);
            const fallbackAlbums = sortAlbums(localAlbums, sortBy);
            const fallbackArtists = sortArtists(localArtists, sortBy);

            try {
                if (contentTab === 'albums') {
                    try {
                        const result = await libraryApi.getAlbums(sourceFilter, sortBy);
                        const mapped = result.map(mapAlbumDto);
                        const merged = mergeLibraryItems(mapped, localAlbums, sourceFilter);
                        setItems(sortAlbums(merged, sortBy));
                    } catch {
                        setItems(
                            sourceFilter === 'pcloud' ? [] : fallbackAlbums
                        );
                    }
                    return;
                }

                if (contentTab === 'artists') {
                    try {
                        const result = await libraryApi.getArtists(sourceFilter, sortBy);
                        const mapped = result.map(mapArtistDto);
                        const merged = mergeLibraryItems(mapped, localArtists, sourceFilter);
                        setItems(sortArtists(merged, sortBy));
                    } catch {
                        setItems(
                            sourceFilter === 'pcloud' ? [] : fallbackArtists
                        );
                    }
                    return;
                }

                if (contentTab === 'tracks') {
                    try {
                        const result = await libraryApi.getTracks(sourceFilter, sortBy);
                        const mapped = result.map(mapTrackDto);
                        const merged = mergeLibraryItems(mapped, localTracks, sourceFilter);
                        setItems(sortTracks(merged, sortBy));
                    } catch {
                        setItems(
                            sourceFilter === 'pcloud' ? [] : fallbackTracks
                        );
                    }
                    return;
                }

                try {
                    const result = await libraryApi.getPlaylists(sourceFilter, sortBy);
                    const mapped = result.map(mapPlaylistDto);
                    setItems(
                        sourceFilter === 'local' || sourceFilter === 'downloaded' ? [] : mapped
                    );
                } catch {
                    setItems([]);
                }
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [contentTab, sourceFilter, sortBy, localTracks]);

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
        playTrack: async (track: Track) => {
            const trackQueue = contentTab === 'tracks' ? (items as Track[]) : [];
            await playTrackAction(track, trackQueue);
            router.push(routes.nowPlaying());
        }
    };
}
