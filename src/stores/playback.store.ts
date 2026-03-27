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

    togglePlayPause: () => void;
    playNext: () => void;
    playPrevious: () => void;
};

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
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

    togglePlayPause: () => set({ isPlaying: !get().isPlaying }),

    playNext: () => {
        const { currentTrack, queue } = get();
        if (!currentTrack || queue.length === 0) return;

        const currentIndex = queue.findIndex((x) => x.id === currentTrack.id);
        const nextTrack = queue[currentIndex + 1];

        if (nextTrack) {
            set({
                currentTrack: nextTrack,
                durationSeconds: nextTrack.durationSeconds ?? 0,
                progressSeconds: 0,
                isPlaying: true,
            });
        }
    },

    playPrevious: () => {
        const { currentTrack, queue } = get();
        if (!currentTrack || queue.length === 0) return;

        const currentIndex = queue.findIndex((x) => x.id === currentTrack.id);
        const previousTrack = queue[currentIndex - 1];

        if (previousTrack) {
            set({
                currentTrack: previousTrack,
                durationSeconds: previousTrack.durationSeconds ?? 0,
                progressSeconds: 0,
                isPlaying: true,
            });
        }
    },
}));