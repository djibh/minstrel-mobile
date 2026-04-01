import { usePlaybackActions } from "@/hooks/usePlaybackActions";
import { minstrelPlayerService } from "@/services/player/player.service";
import { usePlaybackStore } from "@/stores/playback.store";
import { useEffect, useRef } from "react";
import type { AudioStatus } from "expo-audio";
import type { EventSubscription } from "expo-modules-core";

const TRACK_END_EPSILON_SECONDS = 0.35;
const SEEK_GUARD_MS = 1500;
const TRACK_CHANGE_GUARD_MS = 1000;

export function PlaybackSync() {
  const { playNext } = usePlaybackActions();
  const wasPlayingRef = useRef(false);
  const advancingRef = useRef(false);
  const lastHandledTrackEndRef = useRef<string | null>(null);
  const subscribedPlayerRef = useRef<
    ReturnType<typeof minstrelPlayerService.getInstance> | null
  >(null);
  const statusSubscriptionRef = useRef<EventSubscription | null>(null);

  const syncPlaybackState = async (
    params: Pick<AudioStatus, "currentTime" | "duration" | "playing" | "didJustFinish">
  ) => {
    const { currentTime, duration, playing, didJustFinish } = params;
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

    setProgress(currentTime);

    if (duration > 0) {
      setDuration(duration);
    }

    setIsPlaying(playing);

    const isNearTrackEnd =
      duration > 0 &&
      currentTime >= Math.max(duration - TRACK_END_EPSILON_SECONDS, 0);
    const seekGuardActive =
      isSeeking ||
      (typeof lastSeekAt === "number" && now - lastSeekAt < SEEK_GUARD_MS);
    const trackChangeGuardActive =
      typeof lastTrackChangeAt === "number" &&
      now - lastTrackChangeAt < TRACK_CHANGE_GUARD_MS;
    const trackEnded =
      (didJustFinish || (wasPlayingRef.current && !playing && isNearTrackEnd)) &&
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
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const player = minstrelPlayerService.getInstance();
      if (!player) return;

      if (subscribedPlayerRef.current !== player) {
        statusSubscriptionRef.current?.remove();
        subscribedPlayerRef.current = player;
        statusSubscriptionRef.current =
          minstrelPlayerService.addPlaybackStatusListener((status) => {
          void syncPlaybackState(status);
          });
      }

      await syncPlaybackState({
        currentTime: minstrelPlayerService.getCurrentTime(),
        duration: minstrelPlayerService.getDuration(),
        playing: minstrelPlayerService.isPlaying(),
        didJustFinish: player.currentStatus.didJustFinish,
      });
    }, 750);

    return () => {
      clearInterval(interval);
      statusSubscriptionRef.current?.remove();
      statusSubscriptionRef.current = null;
      subscribedPlayerRef.current = null;
    };
  }, [playNext]);

  return null;
}
