import { Track } from '@/domain/models/track.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FavoritesStore = {
    favoriteIds: string[];
    addFavorite: (track: Track) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            favoriteIds: [],

            addFavorite: (track) =>
                set((state) => ({
                    favoriteIds: state.favoriteIds.includes(track.id)
                        ? state.favoriteIds
                        : [...state.favoriteIds, track.id],
                })),

            removeFavorite: (id) =>
                set((state) => ({
                    favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
                })),

            isFavorite: (id) => get().favoriteIds.includes(id),
        }),
        {
            name: 'minstrel-favorites',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
