import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { TrackRow } from "@/components/media/TrackRow";
import { useAlbumDetailsScreen } from "@/hooks/useAlbumDetailsScreen";
import { theme } from "@/theme";
import { ActivityIndicator, Text, View } from "react-native";

export default function AlbumDetailsScreen() {
  const vm = useAlbumDetailsScreen();

  if (vm.isLoading) {
    return (
      <AppScreen>
        <ScreenHeader title="Album" />
        <ActivityIndicator color={theme.colors.accent} />
      </AppScreen>
    );
  }

  if (!vm.album) {
    return (
      <AppScreen>
        <ScreenHeader title="Album" />
        <Text style={{ color: theme.colors.textSecondary }}>
          Album introuvable.
        </Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable>
      <ScreenHeader title="Album" />

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
          {vm.album.title}
        </Text>

        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.body,
            marginBottom: 6,
          }}
        >
          {vm.album.artistName}
        </Text>

        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
          }}
        >
          {vm.albumMeta}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.xxl,
        }}
      >
        <PrimaryButton label="Lire" onPress={vm.playAlbum} />
        <SecondaryButton label="Shuffle" onPress={vm.playAlbum} />
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
          <EmptyState
            title="Aucun résultat"
            description="Essaie avec un autre titre, album, artiste ou playlist."
          />
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
