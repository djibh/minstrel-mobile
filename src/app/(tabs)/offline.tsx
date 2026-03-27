import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { DownloadProgressCard } from "@/components/offline/DownloadProgressCard";
import { OfflineContentList } from "@/components/offline/OfflineContentList";
import { StorageStatusCard } from "@/components/offline/StorageStatusCard";
import { useOfflineScreen } from "@/hooks/useOfflineScreen";
import { theme } from "@/theme";
import { View } from "react-native";

export default function OfflineScreen() {
  const vm = useOfflineScreen();

  return (
    <AppScreen scrollable>
      <ScreenHeader title="Offline" subtitle="Téléchargements et cache" />

      <StorageStatusCard
        usedBytes={vm.cacheUsedBytes}
        maxBytes={vm.cacheMaxBytes}
      />

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="Téléchargements en cours" />

      <View style={{ gap: theme.spacing.md }}>
        {vm.downloads.map((item) => (
          <DownloadProgressCard key={item.id} item={item} />
        ))}
      </View>

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="Disponibles hors ligne" />

      <OfflineContentList items={vm.offlineItems} />
    </AppScreen>
  );
}
