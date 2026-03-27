import { DownloadItem } from "@/stores/offline.store";
import { theme } from "@/theme";
import { Text, View } from "react-native";

type Props = {
  item: DownloadItem;
};

export function DownloadProgressCard({ item }: Props) {
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.md,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontWeight: "600",
            fontSize: theme.typography.body,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {item.label}
        </Text>

        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.caption,
            marginLeft: theme.spacing.md,
          }}
        >
          {item.progress}%
        </Text>
      </View>

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
            width: `${item.progress}%`,
            height: "100%",
            backgroundColor: theme.colors.accent,
          }}
        />
      </View>
    </View>
  );
}
