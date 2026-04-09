import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { LocalLibrarySummary } from "@/stores/offline.store";
import { theme } from "@/theme";
import { Disc3, Music2, UserRound } from "lucide-react-native";
import { Text, View } from "react-native";

type Props = {
  summary: LocalLibrarySummary;
  onImportFiles?: () => void;
};

const stats = [
  { key: "trackCount", label: "Morceaux", icon: Music2 },
  { key: "albumCount", label: "Albums", icon: Disc3 },
  { key: "artistCount", label: "Artistes", icon: UserRound },
] as const;

export function LocalLibraryCard({ summary, onImportFiles }: Props) {
  const scanLabel =
    summary.scanState === "scanning" ? "Scan en cours" : summary.lastScanLabel;

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
      <View style={{ gap: theme.spacing.xs }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.cardTitle,
            fontWeight: "700",
          }}
        >
          Bibliothèque locale
        </Text>

        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.body,
          }}
        >
          {scanLabel}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.md,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          const value = summary[stat.key];

          return (
            <View
              key={stat.key}
              style={{
                flex: 1,
                borderRadius: theme.radius.lg,
                backgroundColor: theme.colors.surfaceAlt,
                padding: theme.spacing.md,
                gap: theme.spacing.sm,
              }}
            >
              <Icon size={18} color={theme.colors.accent} />
              <Text
                style={{
                  color: theme.colors.textPrimary,
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                {value}
              </Text>
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.caption,
                }}
              >
                {stat.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={{ flexDirection: "row" }}>
        <PrimaryButton
          label={
            summary.scanState === "scanning"
              ? "Import en cours..."
              : "Ajouter des fichiers audio"
          }
          onPress={onImportFiles}
        />
      </View>
    </View>
  );
}
