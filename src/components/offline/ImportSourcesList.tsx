import { ImportSourceItem } from "@/stores/offline.store";
import { theme } from "@/theme";
import { Cloud, FolderInput, Smartphone } from "lucide-react-native";
import { Text, View } from "react-native";

type Props = {
  items: ImportSourceItem[];
};

const icons = {
  device: Smartphone,
  folder: FolderInput,
  pcloud: Cloud,
};

export function ImportSourcesList({ items }: Props) {
  return (
    <View
      style={{
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
      }}
    >
      {items.map((item, index) => {
        const Icon = icons[item.kind];
        const badgeColor =
          item.status === "connected"
            ? theme.colors.accent
            : item.status === "attention"
              ? theme.colors.warning
              : theme.colors.textSecondary;

        return (
          <View key={item.id}>
            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing.md,
                alignItems: "center",
                paddingVertical: theme.spacing.md,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: theme.colors.surfaceAlt,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} color={theme.colors.accent} />
              </View>

              <View style={{ flex: 1, gap: theme.spacing.xs }}>
                <Text
                  style={{
                    color: theme.colors.textPrimary,
                    fontWeight: "600",
                    fontSize: theme.typography.body,
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.caption,
                  }}
                >
                  {item.description}
                </Text>
                {item.detail ? (
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontSize: 11,
                    }}
                  >
                    {item.detail}
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radius.pill,
                  backgroundColor: theme.colors.surfaceAlt,
                }}
              >
                <Text
                  style={{
                    color: badgeColor,
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {item.status === "connected"
                    ? "Connecté"
                    : item.status === "attention"
                      ? "Action"
                      : "Prêt"}
                </Text>
              </View>
            </View>

            {index < items.length - 1 ? (
              <View
                style={{
                  height: 1,
                  backgroundColor: theme.colors.border,
                  opacity: 0.35,
                }}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
