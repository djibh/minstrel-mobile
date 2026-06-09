import { EmptyState } from "@/components/feedback/EmptyState";
import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { DownloadProgressCard } from "@/components/offline/DownloadProgressCard";
import { ImportConfirmSheet } from "@/components/offline/ImportConfirmSheet";
import { ImportSourcesList } from "@/components/offline/ImportSourcesList";
import { LocalLibraryCard } from "@/components/offline/LocalLibraryCard";
import { OfflineContentList } from "@/components/offline/OfflineContentList";
import { PCloudConfigModal } from "@/components/offline/PCloudConfigModal";
import { PcloudConnectionCard } from "@/components/offline/PcloudConnectionCard";
import { StorageStatusCard } from "@/components/offline/StorageStatusCard";
import { WebDavConfigModal } from "@/components/offline/WebDavConfigModal";
import { WebDavConnectionCard } from "@/components/offline/WebDavConnectionCard";
import { useOfflineScreen } from "@/hooks/useOfflineScreen";
import { theme } from "@/theme";
import { View } from "react-native";

export default function OfflineScreen() {
  const vm = useOfflineScreen();

  return (
    <AppScreen scrollable>
      <ScreenHeader
        title="Sources"
        subtitle="Local, imports, cloud et contenus téléchargés"
      />

      <PCloudConfigModal
        visible={vm.pcloudConfigVisible}
        onClose={() => vm.setPcloudConfigVisible(false)}
        onSave={(email, password, folderPath, apiBaseUrl, verificationCode) =>
          vm.handlePCloudSave(email, password, folderPath, apiBaseUrl, verificationCode)
        }
      />

      <WebDavConfigModal
        visible={vm.webdavConfigVisible}
        onClose={() => vm.setWebdavConfigVisible(false)}
        onSave={(serverUrl, username, password, folderPath) =>
          vm.handleWebDavSave(serverUrl, username, password, folderPath)
        }
      />

      <ImportConfirmSheet
        assets={vm.pendingImportAssets}
        onConfirm={vm.confirmImport}
        onCancel={vm.cancelImport}
        onRemove={vm.removePendingAsset}
      />

      <LocalLibraryCard
        summary={vm.localLibrarySummary}
        onImportFiles={() => void vm.pickLocalAudio()}
      />

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="pCloud" actionLabel="Configurer" />

      <PcloudConnectionCard
        connection={vm.pcloudConnection}
        onConnect={vm.connectPcloud}
        onManage={vm.managePcloud}
      />

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="WebDAV" actionLabel="Configurer" />

      <WebDavConnectionCard
        connection={vm.webdavConnection}
        onConnect={vm.connectWebDav}
        onManage={vm.manageWebDav}
      />

      <View style={{ height: theme.spacing.xxxl }} />

      <SectionHeader title="Points d’import" actionLabel="Voir tout" />

      <ImportSourcesList
        items={vm.importSources}
        onPressItem={(item) => {
          if (item.kind === "device" || item.kind === "folder") {
            void vm.pickLocalAudio();
          }
        }}
      />

      <View style={{ height: theme.spacing.xxxl }} />

      <StorageStatusCard
        usedBytes={vm.cacheUsedBytes}
        maxBytes={vm.cacheMaxBytes}
      />

      <View style={{ height: theme.spacing.xxxl }} />

      {vm.downloads.length > 0 && (
        <>
          <SectionHeader title="Imports et téléchargements" />
          <View style={{ gap: theme.spacing.md }}>
            {vm.downloads.map((item) => (
              <DownloadProgressCard key={item.id} item={item} />
            ))}
          </View>
          <View style={{ height: theme.spacing.xxxl }} />
        </>
      )}

      <SectionHeader title="Déjà disponibles sur l’appareil" />

      {vm.offlineItems.length > 0 ? (
        <OfflineContentList
          items={vm.offlineItems}
          onPressItem={(itemId) => void vm.playOfflineItem(itemId)}
        />
      ) : (
        <EmptyState
          title="Aucun contenu local"
          description="Ajoute des fichiers audio ou importe une source pour commencer à construire ta bibliothèque."
        />
      )}
    </AppScreen>
  );
}
