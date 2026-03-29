import { Track } from '@/domain/models/track.model';
import { create } from 'zustand';

type PlaybackStore = {
    currentTrack: Track | null;
    queue: Track[];
    isPlaying: boolean;
    progressSeconds: number;
    durationSeconds: number;

    setCurrentTrack: (track: Track | null) => void;
    setQueue: (tracks: Track[]) => void;
    setIsPlaying: (value: boolean) => void;
    setProgress: (value: number) => void;
    setDuration: (value: number) => void;
};

export const usePlaybackStore = create<PlaybackStore>((set) => ({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    progressSeconds: 0,
    durationSeconds: 0,

    setCurrentTrack: (currentTrack) =>
        set({
            currentTrack,
            durationSeconds: currentTrack?.durationSeconds ?? 0,
            progressSeconds: 0,
        }),

    setQueue: (queue) => set({ queue }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setProgress: (progressSeconds) => set({ progressSeconds }),
    setDuration: (durationSeconds) => set({ durationSeconds }),
}));