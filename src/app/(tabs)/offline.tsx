import { EmptyState } from "@/components/feedback/EmptyState";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { DownloadProgressCard } from "@/components/offline/DownloadProgressCard";
import { ImportSourcesList } from "@/components/offline/ImportSourcesList";
import { LocalLibraryCard } from "@/components/offline/LocalLibraryCard";
import { OfflineContentList } from "@/components/offline/OfflineContentList";
import { PcloudConnectionCard } from "@/components/offline/PcloudConnectionCard";
import { StorageStatusCard } from "@/components/offline/StorageStatusCard";
import { useOfflineScreen } from "@/hooks/useOfflineScreen";
import { theme } from "@/theme";
import { View } from "react-native";

export default function OfflineScreen() {
  const vm = useOfflineScreen();

  return (
    <AppScreen scrollable>
      <ScreenHeader
        title="Sources"
        subtitle="Local, imports, pCloud et contenus téléchargés"
      />

      <LocalLibraryCard summary={vm.localLibrarySummary} />

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="pCloud" actionLabel="Configurer" />

      <PcloudConnectionCard connection={vm.pcloudConnection} />

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="Points d’import" actionLabel="Voir tout" />

      <ImportSourcesList items={vm.importSources} />

      <View style={{ height: theme.spacing.xxxl }} />

      <StorageStatusCard
        usedBytes={vm.cacheUsedBytes}
        maxBytes={vm.cacheMaxBytes}
      />

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="Imports et téléchargements" />

      <View style={{ gap: theme.spacing.md }}>
        {vm.downloads.map((item) => (
          <DownloadProgressCard key={item.id} item={item} />
        ))}
      </View>

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="Déjà disponibles sur l’appareil" />

      {vm.offlineItems.length > 0 ? (
        <OfflineContentList items={vm.offlineItems} />
      ) : (
        <EmptyState
          title="Aucun contenu local"
          description="Ajoute des fichiers audio ou importe une source pour commencer à construire ta bibliothèque."
        />
      )}
    </AppScreen>
  );
}
