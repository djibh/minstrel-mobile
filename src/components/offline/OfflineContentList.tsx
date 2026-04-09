import { OfflineMediaItem } from "@/stores/offline.store";
import { theme } from "@/theme";
import { Play } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  items: OfflineMediaItem[];
  onPressItem?: (itemId: string) => void;
};

export function OfflineContentList({ items, onPressItem }: Props) {
  return (
    <View
      style={{
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
      }}
    >
      {items.length === 0 ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            paddingVertical: theme.spacing.lg,
          }}
        >
          Aucun contenu hors ligne disponible.
        </Text>
      ) : (
        items.map((item, index) => (
          <View key={item.id}>
            <Pressable
              onPress={onPressItem ? () => onPressItem(item.id) : undefined}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.md,
                paddingVertical: theme.spacing.md,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.surfaceAlt,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: theme.colors.textPrimary,
                    fontWeight: "600",
                    fontSize: theme.typography.rowTitle,
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.caption,
                  }}
                >
                  {item.subtitle}
                </Text>
                {item.sourceLabel ? (
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontSize: 11,
                      marginTop: 4,
                    }}
                  >
                    {item.sourceLabel}
                  </Text>
                ) : null}
              </View>

              {item.track && onPressItem ? (
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.colors.accentSoft,
                  }}
                >
                  <Play size={16} color={theme.colors.accent} />
                </View>
              ) : (
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: theme.radius.pill,
                    backgroundColor: theme.colors.accentSoft,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.accent,
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
                    Offline
                  </Text>
                </View>
              )}
            </Pressable>

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
        ))
      )}
    </View>
  );
}
