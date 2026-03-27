import { FilterChip } from "@/components/inputs/FilterChip";
import { SegmentedControl } from "@/components/inputs/SegmentedControl";
import { SortButton } from "@/components/inputs/SortButton";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { AlbumCard } from "@/components/media/AlbumCard";
import { ArtistRow } from "@/components/media/ArtistRow";
import { PlaylistCard } from "@/components/media/PlaylistCard";
import { TrackRow } from "@/components/media/TrackRow";
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
        {[
          { label: "all", value: "all" },
          { label: "local", value: "local" },
          { label: "pcloud", value: "pcloud" },
          { label: "downloaded", value: "downloaded" },
        ].map((item) => (
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
        options={[
          { label: "Albums", value: "albums" },
          { label: "Artistes", value: "artists" },
          { label: "Morceaux", value: "tracks" },
          { label: "Playlists", value: "playlists" },
        ]}
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
            <AlbumCard album={item} onPress={() => vm.openAlbum(item.id)} />
          )}
        />
      ) : vm.contentTab === "artists" ? (
        <FlatList
          data={vm.items}
          key="artists-list"
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <ArtistRow artist={item} onPress={() => vm.openArtist(item.id)} />
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
            <TrackRow track={item} onPress={() => vm.playTrack(item)} />
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
              playlist={item}
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
