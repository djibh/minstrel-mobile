import { theme } from "@/theme";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function FilterChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: theme.radius.sm,
        backgroundColor: selected
          ? theme.colors.accentSoft
          : theme.colors.surfaceAlt,
      }}
    >
      <Text
        style={{
          color: selected ? theme.colors.accent : theme.colors.textSecondary,
          fontSize: theme.typography.caption,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
