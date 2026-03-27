import { SearchInput } from "@/components/inputs/SearchInput";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { AlbumCard } from "@/components/media/AlbumCard";
import { PlaylistCard } from "@/components/media/PlaylistCard";
import { ContinueListeningCard } from "@/components/player/ContinueListeningCard";
import { useHomeScreen } from "@/hooks/useHomeScreen";
import { theme } from "@/theme";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const vm = useHomeScreen();

  return (
    <AppScreen scrollable>
      <ScreenHeader
        title="Accueil"
        subtitle="Ta musique, prête à être lancée"
      />

      <SearchInput onPress={vm.openSearch} editable={false} />

      <View style={{ height: theme.spacing.xxl }} />

      {vm.continueListening ? (
        <>
          <ContinueListeningCard
            title={vm.continueListening.title}
            subtitle={vm.continueListening.subtitle}
            meta={vm.continueListening.meta}
            onPress={vm.resumePlayback}
          />
          <View style={{ height: theme.spacing.xxl }} />
        </>
      ) : null}

      <SectionHeader title="Ajouts récents" actionLabel="Voir tout" />

      {vm.isLoading ? (
        <ActivityIndicator color={theme.colors.accent} />
      ) : vm.recentAlbums.length === 0 ? (
        <Text style={{ color: theme.colors.textSecondary }}>
          Aucun album disponible.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: theme.spacing.md,
            paddingRight: theme.spacing.md,
          }}
        >
          {vm.recentAlbums.map((album) => (
            <View key={album.id} style={{ width: 160 }}>
              <AlbumCard album={album} onPress={() => vm.openAlbum(album.id)} />
            </View>
          ))}
        </ScrollView>
      )}

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="Playlists" actionLabel="Voir tout" />

      {vm.isLoading ? (
        <ActivityIndicator color={theme.colors.accent} />
      ) : vm.playlists.length === 0 ? (
        <Text style={{ color: theme.colors.textSecondary }}>
          Aucune playlist disponible.
        </Text>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {vm.playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPress={() => vm.openPlaylist(playlist.id)}
            />
          ))}
        </View>
      )}
    </AppScreen>
  );
}
