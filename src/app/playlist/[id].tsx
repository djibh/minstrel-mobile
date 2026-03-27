import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { TrackRow } from "@/components/media/TrackRow";
import { usePlaylistDetailsScreen } from "@/hooks/usePlaylistDetailsScreen";
import { theme } from "@/theme";
import { ActivityIndicator, Text, View } from "react-native";

export default function PlaylistDetailsScreen() {
  const vm = usePlaylistDetailsScreen();

  if (vm.isLoading) {
    return (
      <AppScreen>
        <ScreenHeader title="Playlist" />
        <ActivityIndicator color={theme.colors.accent} />
      </AppScreen>
    );
  }

  if (!vm.playlist) {
    return (
      <AppScreen>
        <ScreenHeader title="Playlist" />
        <Text style={{ color: theme.colors.textSecondary }}>
          Playlist introuvable.
        </Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable>
      <ScreenHeader title="Playlist" />

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
          {vm.playlist.name}
        </Text>

        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.body,
            marginBottom: 6,
          }}
        >
          Playlist Minstrel
        </Text>

        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
          }}
        >
          {vm.playlistMeta}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.xxl,
        }}
      >
        <PrimaryButton label="Lire" onPress={vm.playPlaylist} />
        <SecondaryButton label="Shuffle" onPress={vm.playPlaylist} />
      </View>

      <View
        style={{
          borderRadius: theme.radius.xl,
          backgroundColor: theme.colors.surface,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
        }}
      >
        {vm.tracks.length === 0 ? (
          <Text
            style={{
              color: theme.colors.textSecondary,
              paddingVertical: theme.spacing.lg,
            }}
          >
            Aucun morceau disponible pour cette playlist.
          </Text>
        ) : (
          vm.tracks.map((track, index) => (
            <View key={track.id}>
              <TrackRow track={track} onPress={() => vm.playTrack(track)} />
              {index < vm.tracks.length - 1 ? (
                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.colors.border,
                    opacity: 0.35,
                  }}
                />
              ) : null}
            </View>
          ))
        )}
      </View>
    </AppScreen>
  );
}
