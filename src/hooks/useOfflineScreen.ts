import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { Album } from '@/domain/models/album.model';
import { Artist } from '@/domain/models/artist.model';
import { Track } from '@/domain/models/track.model';
import { usePlaybackActions } from '@/hooks/usePlaybackActions';
import { PendingImportAsset, useOfflineStore } from '@/stores/offline.store';
import { useRouter } from 'expo-router';
import { routes } from '@/utils/routes';
import { useEffect } from 'react';
import { readAudioMetadata } from '@/utils/audioMetadata';

function copyToAudioDir(sourceUri: string, filename: string): string {
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const audioDir = new Directory(Paths.document, 'audio');
    audioDir.create({ idempotent: true });
    const destFile = new File(audioDir, safeFilename);
    if (!destFile.exists) {
        new File(sourceUri).copy(destFile);
    }
    return destFile.uri;
}

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
        pendingImportAssets,
        setCacheUsedBytes,
        setImportSources,
        setLocalLibrarySummary,
        setOfflineItems,
        setLocalTracks,
        setPendingImportAssets,
    } = useOfflineStore();

    useEffect(() => {
        try {
            const audioDir = new Directory(Paths.document, 'audio');
            if (!audioDir.exists) {
                setCacheUsedBytes(0);
                return;
            }
            const files = audioDir.list();
            const totalBytes = files.reduce(
                (sum, item) => sum + (item instanceof File ? (item.size ?? 0) : 0),
                0
            );
            setCacheUsedBytes(totalBytes);
        } catch {
            // leave previous value if reading fails
        }
    }, [localTracks]);

    const pickLocalAudio = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (result.canceled || result.assets.length === 0) return;

            const pending: PendingImportAsset[] = await Promise.all(
                result.assets.map(async (asset) => {
                    const safeFilename = asset.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                    const trackId = `local-${safeFilename}`;
                    const filenameMeta = extractTrackMetadata(asset.name);
                    const audioMeta = await readAudioMetadata(asset.uri, trackId);
                    return {
                        id: trackId,
                        name: asset.name,
                        uri: asset.uri,
                        size: asset.size,
                        title: audioMeta.title || filenameMeta.title,
                        artistName: audioMeta.artist || filenameMeta.artistName,
                        albumTitle: audioMeta.album || filenameMeta.albumTitle,
                        coverUrl: audioMeta.coverUrl,
                    };
                })
            );

            setPendingImportAssets(pending);
        } catch {
            setImportSources(
                useOfflineStore.getState().importSources.map((item) =>
                    item.kind === 'device' || item.kind === 'folder'
                        ? { ...item, status: 'attention', detail: "Impossible d'ouvrir le sélecteur" }
                        : item
                )
            );
        }
    };

    const confirmImport = () => {
        const assets = useOfflineStore.getState().pendingImportAssets;
        if (assets.length === 0) return;

        const previousItems = useOfflineStore.getState().offlineItems;
        const previousLocalTracks = useOfflineStore.getState().localTracks;

        setLocalLibrarySummary({
            ...useOfflineStore.getState().localLibrarySummary,
            scanState: 'scanning',
            lastScanLabel: 'Import local en cours...',
        });

        const importedTracks: Track[] = assets.map((asset) => {
            const permanentUri = copyToAudioDir(asset.uri, asset.name);
            return {
                id: asset.id,
                sourceId: 'device-storage',
                sourceKind: 'local' as const,
                title: asset.title,
                artistName: asset.artistName,
                albumTitle: asset.albumTitle,
                subtitle: `${asset.artistName} · ${asset.albumTitle}`,
                durationLabel: '--:--',
                streamUri: permanentUri,
                coverUrl: asset.coverUrl ?? null,
                isOfflineAvailable: true,
            };
        });

        const newIds = new Set(importedTracks.map((t) => t.id));
        const mergedLocalTracks = [
            ...previousLocalTracks.filter((t) => !newIds.has(t.id)),
            ...importedTracks,
        ];

        const importedItems = importedTracks.map((track, index) => ({
            id: track.id,
            type: 'track' as const,
            title: track.title,
            subtitle: `${track.artistName} · ${track.albumTitle} · ${formatBytes(assets[index]?.size)}`,
            sourceLabel: 'Local',
            track,
        }));

        const mergedOfflineItems = [
            ...importedItems,
            ...previousItems.filter((item) => item.sourceLabel !== 'Local' || !newIds.has(item.id)),
        ];

        const localAlbums = buildLocalAlbums(mergedLocalTracks);
        const localArtists = buildLocalArtists(mergedLocalTracks);
        setLocalTracks(mergedLocalTracks);
        setOfflineItems(mergedOfflineItems);
        setPendingImportAssets([]);

        setLocalLibrarySummary({
            trackCount: mergedLocalTracks.length,
            albumCount: localAlbums.length,
            artistCount: localArtists.length,
            lastScanLabel: `${mergedLocalTracks.length} fichier(s) local(aux) importé(s)`,
            scanState: 'ready',
        });

        setImportSources(
            useOfflineStore.getState().importSources.map((item) =>
                item.kind === 'device' || item.kind === 'folder'
                    ? {
                        ...item,
                        status: mergedLocalTracks.length > 0 ? 'connected' : 'available',
                        detail: `${mergedLocalTracks.length} fichier(s) prêt(s)`,
                    }
                    : item
            )
        );
    };

    const connectPcloud = () => {
        // pCloud auth flow — à implémenter
    };

    const managePcloud = () => {
        // gestion du compte pCloud connecté — à implémenter
    };

    const cancelImport = () => {
        setPendingImportAssets([]);
    };

    const removePendingAsset = (id: string) => {
        setPendingImportAssets(
            useOfflineStore.getState().pendingImportAssets.filter((a) => a.id !== id)
        );
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
        pendingImportAssets,
        pickLocalAudio,
        confirmImport,
        cancelImport,
        removePendingAsset,
        playOfflineItem,
        connectPcloud,
        managePcloud,
    };
}
