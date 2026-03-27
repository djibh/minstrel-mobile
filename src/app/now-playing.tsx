import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
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

      <View
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: theme.radius.xl,
          backgroundColor: theme.colors.surfaceAlt,
          marginBottom: theme.spacing.xxl,
        }}
      />

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
      />

      <View style={{ height: theme.spacing.xxxl }} />

      <PlayerControls
        isPlaying={vm.isPlaying}
        onTogglePlayPause={vm.togglePlayPause}
        onNext={vm.skipNext}
        onPrevious={vm.skipPrevious}
      />

      <View style={{ height: theme.spacing.xxl }} />

      <PlayerActionRow />

      <View style={{ height: theme.spacing.xxxl }} />

      <QueuePreview tracks={vm.nextTracks} />
    </AppScreen>
  );
}
