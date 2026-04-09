import * as DocumentPicker from 'expo-document-picker';
import { Track } from '@/domain/models/track.model';
import { usePlaybackActions } from '@/hooks/usePlaybackActions';
import { useOfflineStore } from '@/stores/offline.store';
import { useRouter } from 'expo-router';
import { routes } from '@/utils/routes';

function stripFileExtension(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, '');
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
        setImportSources,
        setLocalLibrarySummary,
        setOfflineItems,
    } = useOfflineStore();

    const importLocalAudio = async () => {
        const previousItems = useOfflineStore.getState().offlineItems;
        const previousTrackItems = previousItems.filter((item) => item.type === 'track');

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
                    scanState: previousTrackItems.length > 0 ? 'ready' : 'idle',
                    lastScanLabel:
                        previousTrackItems.length > 0
                            ? `${previousTrackItems.length} fichier(s) local(aux) importé(s)`
                            : 'Aucun fichier local importe',
                });
                return;
            }

            const importedTracks: Track[] = result.assets.map((asset, index) => ({
                id: `local-${Date.now()}-${index}`,
                sourceId: 'device-storage',
                sourceKind: 'local',
                title: stripFileExtension(asset.name),
                artistName: 'Fichier local',
                albumTitle: 'Import local',
                subtitle: asset.name,
                durationLabel: '--:--',
                streamUri: asset.uri,
                coverUrl: null,
                isOfflineAvailable: true,
            }));

            const importedItems = importedTracks.map((track, index) => ({
                id: track.id,
                type: 'track' as const,
                title: track.title,
                subtitle: `${track.artistName} · ${formatBytes(result.assets[index]?.size)}`,
                sourceLabel: 'Local',
                track,
            }));

            setOfflineItems([
                ...importedItems,
                ...previousItems.filter((item) => item.sourceLabel !== 'Local'),
            ]);

            setLocalLibrarySummary({
                trackCount: importedItems.length,
                albumCount: importedItems.length > 0 ? 1 : 0,
                artistCount: importedItems.length > 0 ? 1 : 0,
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

        const queue = currentItems
            .map((entry) => entry.track)
            .filter((track): track is Track => !!track);

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
        importLocalAudio,
        playOfflineItem,
    };
}
