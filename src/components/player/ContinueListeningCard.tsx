import { theme } from "@/theme";
import { Play } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  meta?: string;
  onPress?: () => void;
};

export function ContinueListeningCard({
  title,
  subtitle,
  meta,
  onPress,
}: Props) {
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
          color: theme.colors.textSecondary,
          fontSize: theme.typography.caption,
          marginBottom: theme.spacing.md,
          fontWeight: "600",
        }}
      >
        Continuer l’écoute
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.lg,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.surfaceAlt,
          }}
        />

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.cardTitle,
              fontWeight: "700",
              marginBottom: 4,
            }}
          >
            {title}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.body,
              marginBottom: 4,
            }}
          >
            {subtitle}
          </Text>

          {meta ? (
            <Text
              numberOfLines={1}
              style={{
                color: theme.colors.textMuted,
                fontSize: theme.typography.caption,
              }}
            >
              {meta}
            </Text>
          ) : null}
        </View>
      </View>

      <Pressable
        onPress={onPress}
        style={{
          marginTop: theme.spacing.lg,
          minHeight: 48,
          borderRadius: theme.radius.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.accent,
          flexDirection: "row",
          gap: theme.spacing.sm,
        }}
      >
        <Play size={18} color={theme.colors.bg} />
        <Text
          style={{
            color: theme.colors.bg,
            fontSize: theme.typography.body,
            fontWeight: "700",
          }}
        >
          Reprendre
        </Text>
      </Pressable>
    </View>
  );
}
