import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { AlbumCard } from "@/components/media/AlbumCard";
import { TrackRow } from "@/components/media/TrackRow";
import { useArtistDetailsScreen } from "@/hooks/useArtistDetailsScreen";
import { theme } from "@/theme";
import { ActivityIndicator, Text, View } from "react-native";

export default function ArtistDetailsScreen() {
  const vm = useArtistDetailsScreen();

  if (vm.isLoading) {
    return (
      <AppScreen>
        <ScreenHeader title="Artiste" />
        <ActivityIndicator color={theme.colors.accent} />
      </AppScreen>
    );
  }

  if (!vm.artist) {
    return (
      <AppScreen>
        <ScreenHeader title="Artiste" />
        <Text style={{ color: theme.colors.textSecondary }}>
          Artiste introuvable.
        </Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable>
      <ScreenHeader title="Artiste" />

      {/* Avatar */}
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: theme.colors.surfaceAlt,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginBottom: theme.spacing.lg,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontWeight: "700",
            fontSize: 36,
          }}
        >
          {vm.artist.name?.charAt(0).toUpperCase() ?? "?"}
        </Text>
      </View>

      {/* Nom + meta */}
      <View
        style={{
          alignItems: "center",
          marginBottom: theme.spacing.xl,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 26,
            fontWeight: "700",
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          {vm.artist.name}
        </Text>

        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
          }}
        >
          {[
            vm.albums.length > 0
              ? `${vm.albums.length} album${vm.albums.length > 1 ? "s" : ""}`
              : null,
            vm.tracks.length > 0
              ? `${vm.tracks.length} morceau${vm.tracks.length > 1 ? "x" : ""}`
              : null,
          ]
            .filter(Boolean)
            .join(" • ")}
        </Text>
      </View>

      {/* Boutons */}
      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.xxl,
        }}
      >
        <PrimaryButton label="Lire" onPress={vm.playAll} />
        <SecondaryButton label="Shuffle" onPress={vm.shuffleAll} />
      </View>

      {/* Albums */}
      {vm.albums.length > 0 && (
        <View style={{ marginBottom: theme.spacing.xxl }}>
          <SectionHeader title="Albums" />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.md,
            }}
          >
            {vm.albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPress={() => vm.openAlbum(album.id)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Pistes */}
      {vm.tracks.length > 0 && (
        <View
          style={{
            borderRadius: theme.radius.xl,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.sm,
          }}
        >
          <SectionHeader title="Morceaux" />
          {vm.tracks.map((track, index) => (
            <View key={track.id}>
              <TrackRow track={track} onPress={() => vm.playTrack(track)} />
              {index < vm.tracks.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.colors.border,
                    opacity: 0.35,
                  }}
                />
              )}
            </View>
          ))}
        </View>
      )}

      {vm.albums.length === 0 && vm.tracks.length === 0 && (
        <EmptyState
          title="Aucun contenu"
          description="Aucun album ni morceau trouvé pour cet artiste."
        />
      )}
    </AppScreen>
  );
}
