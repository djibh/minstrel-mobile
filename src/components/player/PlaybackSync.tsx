import { usePlaybackActions } from "@/hooks/usePlaybackActions";
import { minstrelPlayerService } from "@/services/player/player.service";
import { usePlaybackStore } from "@/stores/playback.store";
import { useEffect, useRef } from "react";

export function PlaybackSync() {
  const playbackStore = usePlaybackStore();
  const { playNext } = usePlaybackActions();
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const player = minstrelPlayerService.getInstance();
      if (!player) return;

      const progress = minstrelPlayerService.getCurrentTime();
      const duration = minstrelPlayerService.getDuration();
      const playing = minstrelPlayerService.isPlaying();

      playbackStore.setProgress(progress);

      if (duration > 0) {
        playbackStore.setDuration(duration);
      }

      playbackStore.setIsPlaying(playing);

      const trackEnded =
        wasPlayingRef.current &&
        !playing &&
        duration > 0 &&
        progress >= Math.max(duration - 1, 0);

      if (trackEnded) {
        await playNext();
      }

      wasPlayingRef.current = playing;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}
