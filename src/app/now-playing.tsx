import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { AlbumCover } from "@/components/media/AlbumCover";
import { PlaybackProgress } from "@/components/player/PlaybackProgress";
import { PlayerActionRow } from "@/components/player/PlayerActionRow";
import { PlayerControls } from "@/components/player/PlayerControls";
import { QueuePreview } from "@/components/player/QueuePreview";
import { useNowPlayingScreen } from "@/hooks/useNowPlayingScreen";
import { theme } from "@/theme";
import { Text, View } from "react-native";

export default function NowPlayingScreen() {
  const vm = useNowPlayingScreen();

  if (!vm.currentTrack) {
    return (
      <AppScreen>
        <ScreenHeader title="Lecture en cours" />
        <Text style={{ color: theme.colors.textSecondary }}>
          Aucun morceau sélectionné.
        </Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable>
      <ScreenHeader title="Lecture en cours" />

      <View style={{ width: "100%", marginBottom: theme.spacing.xxl }}>
        <AlbumCover
          size="100%"
          radius={theme.radius.xl}
          coverUrl={vm.currentTrack.coverUrl}
          iconSize={66}
        />
      </View>

      <View style={{ marginBottom: theme.spacing.xl }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 30,
            fontWeight: "700",
            marginBottom: 6,
          }}
        >
          {vm.currentTrack.title}
        </Text>

        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.body,
            marginBottom: 4,
          }}
        >
          {vm.currentTrack.artistName}
        </Text>

        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
          }}
        >
          {vm.currentTrack.albumTitle}
        </Text>
      </View>

      <PlaybackProgress
        progress={vm.progressSeconds}
        duration={vm.durationSeconds}
        onSeek={vm.seekTo}
      />

      <View style={{ height: theme.spacing.xxxl }} />

      <PlayerControls
        isPlaying={vm.isPlaying}
        repeatMode={vm.repeatMode}
        shuffleEnabled={vm.shuffleEnabled}
        onTogglePlayPause={vm.togglePlayPause}
        onNext={vm.skipNext}
        onPrevious={vm.skipPrevious}
        onToggleShuffle={vm.toggleShuffle}
        onCycleRepeat={vm.cycleRepeatMode}
      />

      <View style={{ height: theme.spacing.xxl }} />

      <PlayerActionRow />

      <View style={{ height: theme.spacing.xxxl }} />

      <QueuePreview tracks={vm.nextTracks} />
    </AppScreen>
  );
}
