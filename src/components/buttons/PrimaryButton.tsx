import { theme } from "@/theme";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
};

export function PrimaryButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: 48,
        borderRadius: theme.radius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.accent,
      }}
    >
      <Text
        style={{
          color: theme.colors.bg,
          fontWeight: "700",
          fontSize: theme.typography.body,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
