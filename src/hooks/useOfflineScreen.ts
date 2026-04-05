import { useOfflineStore } from '@/stores/offline.store';

export function useOfflineScreen() {
    const {
        cacheUsedBytes,
        cacheMaxBytes,
        localLibrarySummary,
        pcloudConnection,
        importSources,
        downloads,
        offlineItems,
    } = useOfflineStore();

    return {
        cacheUsedBytes,
        cacheMaxBytes,
        localLibrarySummary,
        pcloudConnection,
        importSources,
        downloads,
        offlineItems,
    };
}
