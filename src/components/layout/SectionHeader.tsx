import { theme } from "@/theme";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onPressAction }: Props) {
  return (
    <View
      style={{
        marginBottom: theme.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.sectionTitle,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>

      {actionLabel ? (
        <Pressable onPress={onPressAction}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.caption,
              fontWeight: "600",
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
