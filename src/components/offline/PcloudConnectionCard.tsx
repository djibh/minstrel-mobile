import { PcloudConnection } from "@/stores/offline.store";
import { theme } from "@/theme";
import { Cloud, CloudDownload, CloudOff } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  connection: PcloudConnection;
  onConnect?: () => void;
  onManage?: () => void;
};

const cardStyle = {
  borderRadius: theme.radius.xl,
  backgroundColor: theme.colors.surface,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: theme.spacing.lg,
  gap: theme.spacing.lg,
} as const;

const iconCircleStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  backgroundColor: theme.colors.surfaceAlt,
};

export function PcloudConnectionCard({ connection, onConnect, onManage }: Props) {
  if (connection.status === "disconnected") {
    return (
      <View style={cardStyle}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
          <View style={iconCircleStyle}>
            <CloudOff size={22} color={theme.colors.textMuted} />
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.cardTitle, fontWeight: "700" }}>
              pCloud
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.body }}>
              Aucun compte connecté
            </Text>
          </View>
        </View>

        <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.body, lineHeight: 20 }}>
          Connectez un compte pCloud pour parcourir et importer votre bibliothèque cloud directement dans Minstrel.
        </Text>

        <Pressable
          onPress={onConnect}
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.pill,
            backgroundColor: theme.colors.accent,
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.colors.bg, fontWeight: "700", fontSize: theme.typography.body }}>
            Connecter un compte pCloud
          </Text>
        </Pressable>
      </View>
    );
  }

  const Icon = connection.status === "syncing" ? Cloud : CloudDownload;
  const accentColor = connection.status === "syncing" ? theme.colors.warning : theme.colors.accent;
  const statusLabel = connection.status === "syncing" ? "Synchronisation" : "Connecté";

  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
        <View style={iconCircleStyle}>
          <Icon size={22} color={accentColor} />
        </View>

        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.cardTitle, fontWeight: "700" }}>
            pCloud
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.body }}>
            {connection.accountLabel}
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
          <Text style={{ color: accentColor, fontSize: theme.typography.caption, fontWeight: "700" }}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 11 }}>Mode</Text>
          <Text style={{ color: theme.colors.textPrimary, fontWeight: "600" }}>
            {connection.libraryMode === "import" ? "Import dans Minstrel" : "Parcourir"}
          </Text>
        </View>
        <View style={{ gap: theme.spacing.xs, alignItems: "flex-end" }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 11 }}>Morceaux synchronisés</Text>
          <Text style={{ color: theme.colors.textPrimary, fontWeight: "600" }}>
            {connection.syncedTrackCount}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onManage}
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
