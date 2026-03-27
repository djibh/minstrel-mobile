import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { usePlaybackStore } from "@/stores/playback.store";
import { theme } from "@/theme";
import { Text } from "react-native";

export default function NowPlayingScreen() {
  const { currentTrack } = usePlaybackStore();

  return (
    <AppScreen>
      <ScreenHeader title="Lecture en cours" />
      <Text style={{ color: theme.colors.textPrimary }}>
        {currentTrack?.title ?? "Aucun morceau"}
      </Text>
      <Text style={{ color: theme.colors.textSecondary }}>
        {currentTrack?.artistName ?? ""}
      </Text>
    </AppScreen>
  );
}
