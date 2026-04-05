import { PcloudConnection } from "@/stores/offline.store";
import { theme } from "@/theme";
import { Cloud, CloudDownload, CloudOff } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  connection: PcloudConnection;
};

export function PcloudConnectionCard({ connection }: Props) {
  const Icon =
    connection.status === "connected"
      ? CloudDownload
      : connection.status === "syncing"
        ? Cloud
        : CloudOff;

  const accentColor =
    connection.status === "connected"
      ? theme.colors.accent
      : connection.status === "syncing"
        ? theme.colors.warning
        : theme.colors.textMuted;

  const statusLabel =
    connection.status === "connected"
      ? "Connecté"
      : connection.status === "syncing"
        ? "Synchronisation"
        : "Non connecté";

  return (
    <View
      style={{
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.lg,
        gap: theme.spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.surfaceAlt,
          }}
        >
          <Icon size={22} color={accentColor} />
        </View>

        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.cardTitle,
              fontWeight: "700",
            }}
          >
            pCloud
          </Text>

          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.body,
            }}
          >
            {connection.accountLabel ?? "Aucun compte connecté"}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.pill,
            backgroundColor: theme.colors.accentSoft,
          }}
        >
          <Text
            style={{
              color: accentColor,
              fontSize: theme.typography.caption,
              fontWeight: "700",
            }}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 11 }}>
            Mode
          </Text>
          <Text style={{ color: theme.colors.textPrimary, fontWeight: "600" }}>
            {connection.libraryMode === "import" ? "Import dans Minstrel" : "Parcourir"}
          </Text>
        </View>

        <View style={{ gap: theme.spacing.xs, alignItems: "flex-end" }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 11 }}>
            Morceaux synchronisés
          </Text>
          <Text style={{ color: theme.colors.textPrimary, fontWeight: "600" }}>
            {connection.syncedTrackCount}
          </Text>
        </View>
      </View>

      <Pressable
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.accentSoft,
        }}
      >
        <Text style={{ color: theme.colors.accent, fontWeight: "700" }}>
          Gérer la connexion
        </Text>
      </Pressable>
    </View>
  );
}
