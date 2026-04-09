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

function buildLocalAlbums(tracks: Track[]) {
    const albumMap = new Map<string, Album>();

    tracks.forEach((track) => {
        const key = `${track.sourceKind}:${track.albumTitle}`;
        const existing = albumMap.get(key);

        if (existing) {
            existing.trackCount += 1;
            return;
        }

        albumMap.set(key, {
            id: `local-album-${track.albumTitle.toLowerCase().replace(/\s+/g, '-')}`,
            sourceId: track.sourceId,
            sourceKind: 'local',
            title: track.albumTitle,
            artistName: track.artistName,
            year: null,
            trackCount: 1,
            coverUrl: track.coverUrl ?? null,
            isOfflineAvailable: true,
        });
    });

    return [...albumMap.values()];
}

function buildLocalArtists(tracks: Track[]) {
    const artistMap = new Map<string, Artist>();

    tracks.forEach((track) => {
        const key = `${track.sourceKind}:${track.artistName}`;
        const existing = artistMap.get(key);

        if (existing) {
            existing.trackCount += 1;
            return;
        }

        artistMap.set(key, {
            id: `local-artist-${track.artistName.toLowerCase().replace(/\s+/g, '-')}`,
            sourceId: track.sourceId,
            sourceKind: 'local',
            name: track.artistName,
            imageUrl: null,
            albumCount: 1,
            trackCount: 1,
            subtitle: 'Bibliotheque locale',
        });
    });

    return [...artistMap.values()].map((artist) => ({
        ...artist,
        albumCount: new Set(
            tracks
                .filter((track) => track.artistName === artist.name)
                .map((track) => track.albumTitle)
        ).size,
    }));
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
    const offlineItems = useOfflineStore((state) => state.offlineItems);
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

            const localTracks = offlineItems
                .map((item) => item.track)
                .filter((track): track is Track => !!track && track.sourceKind === 'local');
            const localAlbums = buildLocalAlbums(localTracks);
            const localArtists = buildLocalArtists(localTracks);

            try {
                if (contentTab === 'albums') {
                    const result = await libraryApi.getAlbums(sourceFilter, sortBy);
                    const mapped = result.map(mapAlbumDto);
                    const merged = mergeLibraryItems(mapped, localAlbums, sourceFilter);
                    setItems(sortAlbums(merged, sortBy));
                    return;
                }

                if (contentTab === 'artists') {
                    const result = await libraryApi.getArtists(sourceFilter, sortBy);
                    const mapped = result.map(mapArtistDto);
                    const merged = mergeLibraryItems(mapped, localArtists, sourceFilter);
                    setItems(sortArtists(merged, sortBy));
                    return;
                }

                if (contentTab === 'tracks') {
                    const result = await libraryApi.getTracks(sourceFilter, sortBy);
                    const mapped = result.map(mapTrackDto);
                    const merged = mergeLibraryItems(mapped, localTracks, sourceFilter);
                    setItems(sortTracks(merged, sortBy));
                    return;
                }

                const result = await libraryApi.getPlaylists(sourceFilter, sortBy);
                const mapped = result.map(mapPlaylistDto);
                setItems(
                    sourceFilter === 'local' || sourceFilter === 'downloaded' ? [] : mapped
                );
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [contentTab, sourceFilter, sortBy, offlineItems]);

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
