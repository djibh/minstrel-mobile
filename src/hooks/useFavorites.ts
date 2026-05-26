import { Track } from '@/domain/models/track.model';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useOfflineStore } from '@/stores/offline.store';

export function useFavorites() {
    const { favoriteIds, addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
    const localTracks = useOfflineStore((state) => state.localTracks);

    const toggleFavorite = (track: Track) => {
        if (isFavorite(track.id)) {
            removeFavorite(track.id);
        } else {
            addFavorite(track);
        }
    };

    const favoriteTracks = localTracks.filter((t) => isFavorite(t.id));

    return {
        favoriteIds,
        favoriteTracks,
        isFavorite,
        toggleFavorite,
    };
}
