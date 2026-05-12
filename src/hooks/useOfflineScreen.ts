import * as DocumentPicker from 'expo-document-picker';
import { Album } from '@/domain/models/album.model';
import { Artist } from '@/domain/models/artist.model';
import { Track } from '@/domain/models/track.model';
import { usePlaybackActions } from '@/hooks/usePlaybackActions';
import { useOfflineStore } from '@/stores/offline.store';
import { useRouter } from 'expo-router';
import { routes } from '@/utils/routes';

function stripFileExtension(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, '');
}

function extractTrackMetadata(fileName: string) {
    const baseName = stripFileExtension(fileName)
        .replace(/[_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const segments = baseName
        .split(' - ')
        .map((part) => part.trim())
        .filter(Boolean);

    if (segments.length >= 3) {
        const [artistName, albumTitle, ...titleParts] = segments;
        return {
            artistName,
            albumTitle,
            title: titleParts.join(' - '),
        };
    }

    if (segments.length === 2) {
        const [artistName, title] = segments;
        return {
            artistName,
            albumTitle: 'Import local',
            title,
        };
    }

    return {
        artistName: 'Fichier local',
        albumTitle: 'Import local',
        title: baseName,
    };
}

function formatBytes(size?: number | null) {
    if (!size || size <= 0) {
        return 'Taille inconnue';
    }

    if (size < 1024 * 1024) {
        return `${Math.round(size / 1024)} Ko`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

export function buildLocalAlbums(tracks: Track[]) {
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

export function buildLocalArtists(tracks: Track[]) {
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

export function useOfflineScreen() {
    const router = useRouter();
    const { playTrack } = usePlaybackActions();
    const {
        cacheUsedBytes,
        cacheMaxBytes,
        localLibrarySummary,
        pcloudConnection,
        importSources,
        downloads,
        offlineItems,
        localTracks,
        setImportSources,
        setLocalLibrarySummary,
        setOfflineItems,
        setLocalTracks,
    } = useOfflineStore();

    const importLocalAudio = async () => {
        const previousItems = useOfflineStore.getState().offlineItems;
        const previousLocalTracks = useOfflineStore.getState().localTracks;

        setLocalLibrarySummary({
            ...useOfflineStore.getState().localLibrarySummary,
            scanState: 'scanning',
            lastScanLabel: 'Import local en cours...',
        });

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (result.canceled || result.assets.length === 0) {
                setLocalLibrarySummary({
                    ...useOfflineStore.getState().localLibrarySummary,
                    scanState: previousLocalTracks.length > 0 ? 'ready' : 'idle',
                    lastScanLabel:
                        previousLocalTracks.length > 0
                            ? `${previousLocalTracks.length} fichier(s) local(aux) importé(s)`
                            : 'Aucun fichier local importe',
                });
                return;
            }

            const importedTracks: Track[] = result.assets.map((asset, index) => {
                const metadata = extractTrackMetadata(asset.name);

                return {
                    id: `local-${Date.now()}-${index}`,
                    sourceId: 'device-storage',
                    sourceKind: 'local',
                    title: metadata.title,
                    artistName: metadata.artistName,
                    albumTitle: metadata.albumTitle,
                    subtitle: `${metadata.artistName} · ${metadata.albumTitle}`,
                    durationLabel: '--:--',
                    streamUri: asset.uri,
                    coverUrl: null,
                    isOfflineAvailable: true,
                };
            });

            const importedItems = importedTracks.map((track, index) => ({
                id: track.id,
                type: 'track' as const,
                title: track.title,
                subtitle: `${track.artistName} · ${track.albumTitle} · ${formatBytes(result.assets[index]?.size)}`,
                sourceLabel: 'Local',
                track,
            }));

            const localAlbums = buildLocalAlbums(importedTracks);
            const localArtists = buildLocalArtists(importedTracks);
            setLocalTracks(importedTracks);

            setOfflineItems([
                ...importedItems,
                ...previousItems.filter((item) => item.sourceLabel !== 'Local'),
            ]);

            setLocalLibrarySummary({
                trackCount: importedItems.length,
                albumCount: localAlbums.length,
                artistCount: localArtists.length,
                lastScanLabel: `${importedItems.length} fichier(s) local(aux) importé(s)`,
                scanState: 'ready',
            });

            setImportSources(
                useOfflineStore.getState().importSources.map((item) =>
                    item.kind === 'device' || item.kind === 'folder'
                        ? {
                            ...item,
                            status: importedItems.length > 0 ? 'connected' : 'available',
                            detail: `${importedItems.length} fichier(s) prêt(s)`,
                        }
                        : item
                )
            );
        } catch {
            setLocalLibrarySummary({
                ...useOfflineStore.getState().localLibrarySummary,
                scanState: 'idle',
                lastScanLabel: 'Import local indisponible',
            });

            setImportSources(
                useOfflineStore.getState().importSources.map((item) =>
                    item.kind === 'device' || item.kind === 'folder'
                        ? {
                            ...item,
                            status: 'attention',
                            detail: 'Impossible d\'ouvrir le selecteur',
                        }
                        : item
                )
            );
        }
    };

    const playOfflineItem = async (itemId: string) => {
        const currentItems = useOfflineStore.getState().offlineItems;
        const item = currentItems.find((entry) => entry.id === itemId);
        if (!item?.track) return;

        const queue = useOfflineStore.getState().localTracks;

        await playTrack(item.track, queue);
        router.push(routes.nowPlaying());
    };

    return {
        cacheUsedBytes,
        cacheMaxBytes,
        localLibrarySummary,
        pcloudConnection,
        importSources,
        downloads,
        offlineItems,
        localTracks,
        importLocalAudio,
        playOfflineItem,
    };
}
