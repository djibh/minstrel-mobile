import { playbackApi } from '@/api/playbackApi';
import { Track } from '@/domain/models/track.model';
import { minstrelPlayerService } from '@/services/player/player.service';
import { RepeatMode, usePlaybackStore } from '@/stores/playback.store';

function sanitizeTimeValue(value: number) {
    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }

    return value;
}

function findTrackIndex(queue: Track[], currentTrack: Track | null) {
    if (!currentTrack) return -1;
    return queue.findIndex((x) => x.id === currentTrack.id);
}

function pickShuffledNext(queue: Track[], currentTrack: Track | null) {
    const candidates = queue.filter((x) => x.id !== currentTrack?.id);
    if (candidates.length === 0) return null;

    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
}

function resolveNextTrack({
    currentTrack,
    queue,
    shuffleEnabled,
    repeatMode,
    reason,
}: {
    currentTrack: Track | null;
    queue: Track[];
    shuffleEnabled: boolean;
    repeatMode: RepeatMode;
    reason: 'auto' | 'manual';
}) {
    if (!currentTrack || queue.length === 0) {
        return null;
    }

    if (reason === 'auto' && repeatMode === 'one') {
        return currentTrack;
    }

    if (shuffleEnabled) {
        return pickShuffledNext(queue, currentTrack);
    }

    const currentIndex = findTrackIndex(queue, currentTrack);
    if (currentIndex < 0) {
        return queue[0] ?? null;
    }

    const nextTrack = queue[currentIndex + 1];
    if (nextTrack) {
        return nextTrack;
    }

    if (repeatMode === 'all') {
        return queue[0] ?? null;
    }

    return null;
}

export function usePlaybackActions() {
    const loadAndPlay = async (track: Track) => {
        const uri = playbackApi.getStreamUrl(track.id);
        const playbackStore = usePlaybackStore.getState();

        playbackStore.setIsTransitioning(true);
        playbackStore.setCurrentTrack(track);
        playbackStore.setDuration(track.durationSeconds ?? 0);
        playbackStore.setProgress(0);

        try {
            await minstrelPlayerService.load(uri);

            const { repeatMode } = usePlaybackStore.getState();
            minstrelPlayerService.setLoop(repeatMode === 'one');

            minstrelPlayerService.setLockScreenMetadata({
                title: track.title,
                artist: track.artistName,
                albumTitle: track.albumTitle,
                artworkUrl: track.coverUrl ?? undefined,
            });

            minstrelPlayerService.play();
            playbackStore.setIsPlaying(true);
        } finally {
            playbackStore.setIsTransitioning(false);
        }
    };

    const playTrack = async (track: Track, queue: Track[] = []) => {
        const effectiveQueue = queue.length > 0 ? queue : [track];
        usePlaybackStore.getState().setQueue(effectiveQueue);
        await loadAndPlay(track);
    };

    const togglePlayPause = () => {
        const { isPlaying, setIsPlaying } = usePlaybackStore.getState();

        if (isPlaying) {
            minstrelPlayerService.pause();
            setIsPlaying(false);
        } else {
            minstrelPlayerService.play();
            setIsPlaying(true);
        }
    };

    const seekTo = (seconds: number) => {
        const safeSeconds = sanitizeTimeValue(seconds);
        const { setIsSeeking, markSeekedAt, setProgress } = usePlaybackStore.getState();

        setIsSeeking(true);
        markSeekedAt(Date.now());
        minstrelPlayerService.seekTo(safeSeconds);
        setProgress(safeSeconds);
        setTimeout(() => {
            usePlaybackStore.getState().setIsSeeking(false);
        }, 300);
    };

    const playNext = async (reason: 'auto' | 'manual' = 'manual') => {
        const { currentTrack, queue, shuffleEnabled, repeatMode } = usePlaybackStore.getState();
        const nextTrack = resolveNextTrack({
            currentTrack,
            queue,
            shuffleEnabled,
            repeatMode,
            reason,
        });

        if (!nextTrack) {
            if (reason === 'auto') {
                usePlaybackStore.getState().setIsPlaying(false);
            }
            return;
        }

        await loadAndPlay(nextTrack);
    };

    const playPrevious = async () => {
        const { currentTrack, queue, progressSeconds, repeatMode } = usePlaybackStore.getState();
        if (!currentTrack || queue.length === 0) return;

        if (progressSeconds > 3) {
            seekTo(0);
            return;
        }

        const currentIndex = findTrackIndex(queue, currentTrack);
        let previousTrack = queue[currentIndex - 1];

        if (!previousTrack && repeatMode === 'all') {
            previousTrack = queue[queue.length - 1];
        }

        if (!previousTrack) {
            seekTo(0);
            return;
        }

        await loadAndPlay(previousTrack);
    };

    const cycleRepeatMode = () => {
        const { repeatMode, setRepeatMode } = usePlaybackStore.getState();

        const nextMode: RepeatMode =
            repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';

        setRepeatMode(nextMode);
        minstrelPlayerService.setLoop(nextMode === 'one');
    };

    const toggleShuffle = () => {
        usePlaybackStore.getState().toggleShuffle();
    };

    return {
        playTrack,
        togglePlayPause,
        seekTo,
        playNext,
        playPrevious,
        cycleRepeatMode,
        toggleShuffle,
    };
}
