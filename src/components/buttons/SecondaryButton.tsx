import { theme } from "@/theme";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
};

export function SecondaryButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: 48,
        borderRadius: theme.radius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.surfaceAlt,
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontWeight: "600",
          fontSize: theme.typography.body,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
