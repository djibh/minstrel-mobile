import { usePlaybackStore } from '@/stores/playback.store';
import { useMemo } from 'react';

export function useNowPlayingScreen() {
    const {
        currentTrack,
        queue,
        isPlaying,
        progressSeconds,
        durationSeconds,
        togglePlayPause,
        playNext,
        playPrevious,
    } = usePlaybackStore();

    const nextTracks = useMemo(() => {
        if (!currentTrack) return [];

        const currentIndex = queue.findIndex((x) => x.id === currentTrack.id);
        if (currentIndex < 0) return [];

        return queue.slice(currentIndex + 1, currentIndex + 4);
    }, [currentTrack, queue]);

    return {
        currentTrack,
        queue,
        nextTracks,
        isPlaying,
        progressSeconds,
        durationSeconds,
        togglePlayPause,
        skipNext: playNext,
        skipPrevious: playPrevious,
    };
}