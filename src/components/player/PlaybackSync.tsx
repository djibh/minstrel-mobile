import { usePlaybackActions } from "@/hooks/usePlaybackActions";
import { minstrelPlayerService } from "@/services/player/player.service";
import { usePlaybackStore } from "@/stores/playback.store";
import { useEffect, useRef } from "react";

const TRACK_END_EPSILON_SECONDS = 0.35;
const SEEK_GUARD_MS = 1500;
const TRACK_CHANGE_GUARD_MS = 1000;

export function PlaybackSync() {
  const { playNext } = usePlaybackActions();
  const wasPlayingRef = useRef(false);
  const advancingRef = useRef(false);
  const lastHandledTrackEndRef = useRef<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const player = minstrelPlayerService.getInstance();
      if (!player) return;

      const progress = minstrelPlayerService.getCurrentTime();
      const duration = minstrelPlayerService.getDuration();
      const playing = minstrelPlayerService.isPlaying();
      const {
        currentTrack,
        repeatMode,
        isSeeking,
        lastSeekAt,
        isTransitioning,
        lastTrackChangeAt,
        setProgress,
        setDuration,
        setIsPlaying,
      } = usePlaybackStore.getState();
      const now = Date.now();

      setProgress(progress);

      if (duration > 0) {
        setDuration(duration);
      }

      setIsPlaying(playing);

      const isNearTrackEnd =
        duration > 0 &&
        progress >= Math.max(duration - TRACK_END_EPSILON_SECONDS, 0);
      const seekGuardActive =
        isSeeking ||
        (typeof lastSeekAt === "number" && now - lastSeekAt < SEEK_GUARD_MS);
      const trackChangeGuardActive =
        typeof lastTrackChangeAt === "number" &&
        now - lastTrackChangeAt < TRACK_CHANGE_GUARD_MS;
      const trackEnded =
        wasPlayingRef.current &&
        !playing &&
        isNearTrackEnd &&
        !seekGuardActive &&
        !trackChangeGuardActive &&
        !isTransitioning &&
        !!currentTrack;

      if (trackEnded && !advancingRef.current) {
        if (lastHandledTrackEndRef.current === currentTrack?.id) {
          wasPlayingRef.current = playing;
          return;
        }

        advancingRef.current = true;
        lastHandledTrackEndRef.current = currentTrack?.id ?? null;
        try {
          await playNext("auto");

          const nextState = usePlaybackStore.getState();
          if (
            nextState.currentTrack?.id === currentTrack?.id &&
            repeatMode === "one"
          ) {
            nextState.setIsPlaying(true);
          }
        } finally {
          advancingRef.current = false;
        }
      }

      if (playing || !currentTrack) {
        lastHandledTrackEndRef.current = null;
      }

      wasPlayingRef.current = playing;
    }, 500);

    return () => clearInterval(interval);
  }, [playNext]);

  return null;
}
