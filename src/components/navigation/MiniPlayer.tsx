import { AlbumCover } from "@/components/media/AlbumCover";
import { usePlaybackActions } from "@/hooks/usePlaybackActions";
import { usePlaybackStore } from "@/stores/playback.store";
import { theme } from "@/theme";
import { routes } from "@/utils/routes";
import { useRouter } from "expo-router";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function MiniPlayer() {
  const router = useRouter();
  const { currentTrack, isPlaying } = usePlaybackStore();
  const { togglePlayPause } = usePlaybackActions();

  if (!currentTrack) {
    return null;
  }

  return (
    <Pressable
      onPress={() => router.push(routes.nowPlaying())}
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 86,
        backgroundColor: theme.colors.bgElevated,
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <AlbumCover size={48} radius={theme.radius.md} />

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{ color: theme.colors.textPrimary, fontWeight: "600" }}
          >
            {currentTrack.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{ color: theme.colors.textSecondary, fontSize: 12 }}
          >
            {currentTrack.artistName}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <SkipBack size={18} color={theme.colors.textSecondary} />
          <Pressable onPress={togglePlayPause}>
            {isPlaying ? (
              <Pause size={20} color={theme.colors.textPrimary} />
            ) : (
              <Play size={20} color={theme.colors.textPrimary} />
            )}
          </Pressable>
          <SkipForward size={18} color={theme.colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
}
