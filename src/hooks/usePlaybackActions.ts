import { playbackApi } from '@/api/playbackApi';
import { Track } from '@/domain/models/track.model';
import { minstrelPlayerService } from '@/services/player/player.service';
import { usePlaybackStore } from '@/stores/playback.store';

function findTrackIndex(queue: Track[], currentTrack: Track | null) {
    if (!currentTrack) return -1;
    return queue.findIndex((x) => x.id === currentTrack.id);
}

export function usePlaybackActions() {
    const playbackStore = usePlaybackStore();

    const loadAndPlay = async (track: Track) => {
        const uri = playbackApi.getStreamUrl(track.id);

        playbackStore.setCurrentTrack(track);
        playbackStore.setDuration(track.durationSeconds ?? 0);
        playbackStore.setProgress(0);

        await minstrelPlayerService.load(uri);
        minstrelPlayerService.play();

        playbackStore.setIsPlaying(true);
    };

    const playTrack = async (track: Track, queue: Track[] = []) => {
        const effectiveQueue = queue.length > 0 ? queue : [track];
        playbackStore.setQueue(effectiveQueue);

        await loadAndPlay(track);
    };

    const togglePlayPause = () => {
        const { isPlaying } = usePlaybackStore.getState();

        if (isPlaying) {
            minstrelPlayerService.pause();
            playbackStore.setIsPlaying(false);
        } else {
            minstrelPlayerService.play();
            playbackStore.setIsPlaying(true);
        }
    };

    const seekTo = (seconds: number) => {
        minstrelPlayerService.seekTo(seconds);
        playbackStore.setProgress(seconds);
    };

    const playNext = async () => {
        const { currentTrack, queue } = usePlaybackStore.getState();

        if (!currentTrack || queue.length === 0) return;

        const currentIndex = findTrackIndex(queue, currentTrack);
        const nextTrack = queue[currentIndex + 1];

        if (!nextTrack) return;

        await loadAndPlay(nextTrack);
    };

    const playPrevious = async () => {
        const { currentTrack, queue, progressSeconds } = usePlaybackStore.getState();

        if (!currentTrack || queue.length === 0) return;

        if (progressSeconds > 3) {
            seekTo(0);
            return;
        }

        const currentIndex = findTrackIndex(queue, currentTrack);
        const previousTrack = queue[currentIndex - 1];

        if (!previousTrack) {
            seekTo(0);
            return;
        }

        await loadAndPlay(previousTrack);
    };

    return {
        playTrack,
        togglePlayPause,
        seekTo,
        playNext,
        playPrevious,
    };
}