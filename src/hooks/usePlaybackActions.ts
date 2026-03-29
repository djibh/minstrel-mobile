import { playbackApi } from '@/api/playbackApi';
import { Track } from '@/domain/models/track.model';
import { minstrelPlayerService } from '@/services/player/player.service';
import { usePlaybackStore } from '@/stores/playback.store';

export function usePlaybackActions() {
    const playbackStore = usePlaybackStore();

    const playTrack = async (track: Track, queue: Track[] = []) => {
        if (queue.length > 0) {
            playbackStore.setQueue(queue);
        }

        playbackStore.setCurrentTrack(track);

        const uri = playbackApi.getStreamUrl(track.id);

        await minstrelPlayerService.load(uri);
        minstrelPlayerService.play();

        playbackStore.setDuration(track.durationSeconds ?? 0);
        playbackStore.setProgress(0);
        playbackStore.setIsPlaying(true);
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

    return {
        playTrack,
        togglePlayPause,
        seekTo,
    };
}