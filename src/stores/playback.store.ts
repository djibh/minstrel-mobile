import { Track } from '@/domain/models/track.model';
import { create } from 'zustand';

export type RepeatMode = 'off' | 'all' | 'one';

type PlaybackStore = {
    currentTrack: Track | null;
    queue: Track[];
    isPlaying: boolean;
    progressSeconds: number;
    durationSeconds: number;
    repeatMode: RepeatMode;
    shuffleEnabled: boolean;
    isSeeking: boolean;
    lastSeekAt: number | null;
    isTransitioning: boolean;
    lastTrackChangeAt: number | null;

    setCurrentTrack: (track: Track | null) => void;
    setQueue: (tracks: Track[]) => void;
    setIsPlaying: (value: boolean) => void;
    setProgress: (value: number) => void;
    setDuration: (value: number) => void;
    setRepeatMode: (value: RepeatMode) => void;
    setIsSeeking: (value: boolean) => void;
    markSeekedAt: (value: number) => void;
    setIsTransitioning: (value: boolean) => void;
    toggleShuffle: () => void;
    setShuffleEnabled: (value: boolean) => void;
};

export const usePlaybackStore = create<PlaybackStore>((set) => ({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    progressSeconds: 0,
    durationSeconds: 0,
    repeatMode: 'off',
    shuffleEnabled: false,
    isSeeking: false,
    lastSeekAt: null,
    isTransitioning: false,
    lastTrackChangeAt: null,

    setCurrentTrack: (currentTrack) =>
        set({
            currentTrack,
            durationSeconds: currentTrack?.durationSeconds ?? 0,
            progressSeconds: 0,
            lastTrackChangeAt: Date.now(),
        }),

    setQueue: (queue) => set({ queue }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setProgress: (progressSeconds) => set({ progressSeconds }),
    setDuration: (durationSeconds) => set({ durationSeconds }),
    setRepeatMode: (repeatMode) => set({ repeatMode }),
    setIsSeeking: (isSeeking) => set({ isSeeking }),
    markSeekedAt: (lastSeekAt) => set({ lastSeekAt }),
    setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
    toggleShuffle: () => set((state) => ({ shuffleEnabled: !state.shuffleEnabled })),
    setShuffleEnabled: (shuffleEnabled) => set({ shuffleEnabled }),
}));
