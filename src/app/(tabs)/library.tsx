import { FilterChip } from "@/components/inputs/FilterChip";
import { SegmentedControl } from "@/components/inputs/SegmentedControl";
import { SortButton } from "@/components/inputs/SortButton";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { AlbumCard } from "@/components/media/AlbumCard";
import { TrackRow } from "@/components/media/TrackRow";
import { useLibraryScreen } from "@/hooks/useLibraryScreen";
import { theme } from "@/theme";
import { FlatList, Text, View } from "react-native";

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
        {["all", "local", "pcloud", "downloaded"].map((item) => (
          <FilterChip
            key={item}
            label={item}
            selected={vm.sourceFilter === item}
            onPress={() => vm.setSourceFilter(item as any)}
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

      {vm.contentTab === "albums" ? (
        <FlatList
          data={vm.items}
          numColumns={2}
          key="albums-grid"
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          renderItem={({ item }) => (
            <AlbumCard album={item} onPress={() => vm.openAlbum(item.id)} />
          )}
        />
      ) : vm.contentTab === "tracks" ? (
        <FlatList
          data={vm.items}
          key="tracks-list"
          renderItem={({ item }) => (
            <TrackRow track={item} onPress={() => vm.playTrack(item)} />
          )}
        />
      ) : (
        <Text style={{ color: theme.colors.textSecondary }}>
          Vue à compléter ensuite.
        </Text>
      )}
    </AppScreen>
  );
}
