import { minstrelPlayerService } from "@/services/player/player.service";
import { usePlaybackStore } from "@/stores/playback.store";
import { useEffect } from "react";

export function PlaybackSync() {
  const playbackStore = usePlaybackStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const progress = minstrelPlayerService.getCurrentTime();
      const duration = minstrelPlayerService.getDuration();
      const playing = minstrelPlayerService.isPlaying();

      playbackStore.setProgress(progress);
      if (duration > 0) {
        playbackStore.setDuration(duration);
      }
      playbackStore.setIsPlaying(playing);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}
