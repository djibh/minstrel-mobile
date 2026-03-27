import { Track } from '@/domain/models/track.model';
import { create } from 'zustand';

type PlaybackStore = {
    currentTrack: Track | null;
    queue: Track[];
    isPlaying: boolean;
    setCurrentTrack: (track: Track | null) => void;
    setQueue: (tracks: Track[]) => void;
    setIsPlaying: (value: boolean) => void;
    togglePlayPause: () => void;
};

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    setCurrentTrack: (currentTrack) => set({ currentTrack }),
    setQueue: (queue) => set({ queue }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    togglePlayPause: () => set({ isPlaying: !get().isPlaying }),
}));