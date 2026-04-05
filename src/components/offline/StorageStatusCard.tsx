import { theme } from "@/theme";
import { formatBytes } from "@/utils/formatBytes";
import { Text, View } from "react-native";

type Props = {
  usedBytes: number;
  maxBytes: number;
  title?: string;
  subtitle?: string;
};

export function StorageStatusCard({
  usedBytes,
  maxBytes,
  title = "Stockage local",
  subtitle = "Cache audio et contenus importés",
}: Props) {
  const ratio = maxBytes > 0 ? Math.min(usedBytes / maxBytes, 1) : 0;

  return (
    <View
      style={{
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.lg,
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.cardTitle,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.body,
          marginTop: theme.spacing.xs,
          marginBottom: theme.spacing.sm,
        }}
      >
        {subtitle}
      </Text>

      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.body,
          marginBottom: theme.spacing.md,
        }}
      >
        {formatBytes(usedBytes)} / {formatBytes(maxBytes)}
      </Text>

      <View
        style={{
          height: 8,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.surfaceAlt,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            backgroundColor: theme.colors.accent,
          }}
        />
      </View>
    </View>
  );
}
