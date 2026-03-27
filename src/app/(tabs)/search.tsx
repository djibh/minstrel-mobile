import { SearchInput } from "@/components/inputs/SearchInput";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { AlbumCard } from "@/components/media/AlbumCard";
import { ArtistRow } from "@/components/media/ArtistRow";
import { PlaylistCard } from "@/components/media/PlaylistCard";
import { TrackRow } from "@/components/media/TrackRow";
import { useSearchScreen } from "@/hooks/useSearchScreen";
import { theme } from "@/theme";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function SearchScreen() {
  const vm = useSearchScreen();

  return (
    <AppScreen scrollable>
      <ScreenHeader
        title="Recherche"
        subtitle="Titres, albums, artistes et playlists"
      />

      <SearchInput
        value={vm.query}
        onChangeText={vm.setQuery}
        onClear={vm.clearQuery}
      />

      <View style={{ height: theme.spacing.xxl }} />

      {!vm.query.trim() ? (
        <Text style={{ color: theme.colors.textSecondary }}>
          Commence à taper pour rechercher dans ta bibliothèque.
        </Text>
      ) : vm.isLoading ? (
        <ActivityIndicator color={theme.colors.accent} />
      ) : !vm.hasResults ? (
        <Text style={{ color: theme.colors.textSecondary }}>
          Aucun résultat trouvé.
        </Text>
      ) : (
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={{ gap: theme.spacing.xxxl }}
        >
          {vm.results.tracks.length > 0 ? (
            <View>
              <SectionHeader title="Morceaux" />
              <View
                style={{
                  borderRadius: theme.radius.xl,
                  backgroundColor: theme.colors.surface,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.sm,
                }}
              >
                {vm.results.tracks.map((track, index) => (
                  <View key={track.id}>
                    <TrackRow
                      track={track}
                      onPress={() => vm.playTrack(track)}
                    />
                    {index < vm.results.tracks.length - 1 ? (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: theme.colors.border,
                          opacity: 0.35,
                        }}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {vm.results.albums.length > 0 ? (
            <View>
              <SectionHeader title="Albums" />
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  rowGap: theme.spacing.lg,
                }}
              >
                {vm.results.albums.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onPress={() => vm.openAlbum(album.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {vm.results.artists.length > 0 ? (
            <View>
              <SectionHeader title="Artistes" />
              <View
                style={{
                  borderRadius: theme.radius.xl,
                  backgroundColor: theme.colors.surface,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.sm,
                }}
              >
                {vm.results.artists.map((artist, index) => (
                  <View key={artist.id}>
                    <ArtistRow
                      artist={artist}
                      onPress={() => vm.openArtist(artist.id)}
                    />
                    {index < vm.results.artists.length - 1 ? (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: theme.colors.border,
                          opacity: 0.35,
                        }}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {vm.results.playlists.length > 0 ? (
            <View>
              <SectionHeader title="Playlists" />
              <View
                style={{
                  borderRadius: theme.radius.xl,
                  backgroundColor: theme.colors.surface,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.sm,
                }}
              >
                {vm.results.playlists.map((playlist, index) => (
                  <View key={playlist.id}>
                    <PlaylistCard
                      playlist={playlist}
                      onPress={() => vm.openPlaylist(playlist.id)}
                    />
                    {index < vm.results.playlists.length - 1 ? (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: theme.colors.border,
                          opacity: 0.35,
                        }}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      )}
    </AppScreen>
  );
}
