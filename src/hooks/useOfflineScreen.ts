import { useOfflineStore } from '@/stores/offline.store';

export function useOfflineScreen() {
    const {
        cacheUsedBytes,
        cacheMaxBytes,
        downloads,
        offlineItems,
    } = useOfflineStore();

    return {
        cacheUsedBytes,
        cacheMaxBytes,
        downloads,
        offlineItems,
    };
}