import { FilterChip } from "@/components/inputs/FilterChip";
import { SegmentedControl } from "@/components/inputs/SegmentedControl";
import { SortButton } from "@/components/inputs/SortButton";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { AlbumCard } from "@/components/media/AlbumCard";
import { ArtistRow } from "@/components/media/ArtistRow";
import { PlaylistCard } from "@/components/media/PlaylistCard";
import { TrackRow } from "@/components/media/TrackRow";
import { libraryTabs } from "@/constants/libraryTabs";
import { sourceFilters } from "@/constants/sourceFilters";
import { Album } from "@/domain/models/album.model";
import { Artist } from "@/domain/models/artist.model";
import { Playlist } from "@/domain/models/playlist.model";
import { Track } from "@/domain/models/track.model";
import { useLibraryScreen } from "@/hooks/useLibraryScreen";
import { theme } from "@/theme";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function LibraryScreen() {
  const vm = useLibraryScreen();

  return (
    <AppScreen>
      <ScreenHeader
        title="Bibliothèque"
        subtitle="Local, cloud et téléchargé"
      />

      <View
        style={{ flexDirection: "row", gap: 8, marginBottom: theme.spacing.lg }}
      >
        {[...sourceFilters].map((item) => (
          <FilterChip
            key={item.value}
            label={item.label}
            selected={vm.sourceFilter === item.value}
            onPress={() => vm.setSourceFilter(item.value as any)}
          />
        ))}
      </View>

      <SegmentedControl
        value={vm.contentTab}
        options={[...libraryTabs]}
        onChange={(value) => vm.setContentTab(value as any)}
      />

      <View
        style={{ marginTop: theme.spacing.lg, marginBottom: theme.spacing.lg }}
      >
        <SortButton label={`Tri : ${vm.sortBy}`} />
      </View>

      {vm.isLoading ? (
        <ActivityIndicator color={theme.colors.accent} />
      ) : vm.contentTab === "albums" ? (
        <FlatList
          data={vm.items}
          numColumns={2}
          key="albums-grid"
          contentContainerStyle={{ paddingBottom: 24 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          renderItem={({ item }) => (
            <AlbumCard
              album={item as Album}
              onPress={() => vm.openAlbum(item.id)}
            />
          )}
        />
      ) : vm.contentTab === "artists" ? (
        <FlatList
          data={vm.items}
          key="artists-list"
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <ArtistRow
              artist={item as Artist}
              onPress={() => vm.openArtist(item.id)}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: theme.colors.border,
                opacity: 0.35,
              }}
            />
          )}
        />
      ) : vm.contentTab === "tracks" ? (
        <FlatList
          data={vm.items}
          key="tracks-list"
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TrackRow
              track={item as Track}
              onPress={() => vm.playTrack(item as Track)}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: theme.colors.border,
                opacity: 0.35,
              }}
            />
          )}
        />
      ) : vm.contentTab === "playlists" ? (
        <FlatList
          data={vm.items}
          key="playlists-list"
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <PlaylistCard
              playlist={item as Playlist}
              onPress={() => vm.openPlaylist(item.id)}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: theme.colors.border,
                opacity: 0.35,
              }}
            />
          )}
        />
      ) : (
        <Text style={{ color: theme.colors.textSecondary }}>
          Aucun contenu disponible.
        </Text>
      )}
    </AppScreen>
  );
}
