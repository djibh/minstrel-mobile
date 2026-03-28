import { theme } from "@/theme";
import { Text, View } from "react-native";

type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <View
      style={{
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.xxl,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.cardTitle,
          fontWeight: "700",
          marginBottom: 6,
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      {description ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.body,
            textAlign: "center",
          }}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}
