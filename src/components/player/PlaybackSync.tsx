import { minstrelPlayerService } from "@/services/player/player.service";
import { usePlaybackStore } from "@/stores/playback.store";
import { useEffect } from "react";

export function PlaybackSync() {
  const playbackStore = usePlaybackStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const player = minstrelPlayerService.getInstance();
      if (!player) return;

      playbackStore.setProgress(minstrelPlayerService.getCurrentTime());

      const duration = minstrelPlayerService.getDuration();
      if (duration > 0) {
        playbackStore.setDuration(duration);
      }

      playbackStore.setIsPlaying(minstrelPlayerService.isPlaying());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}
