import { theme } from "@/theme";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
};

export function SortButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.surfaceAlt,
      }}
    >
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.caption,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
