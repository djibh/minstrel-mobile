import { theme } from "@/theme";
import { Search } from "lucide-react-native";
import { Pressable, Text } from "react-native";

type Props = {
  placeholder?: string;
  onPress?: () => void;
};

export function SearchInput({
  placeholder = "Rechercher morceaux, artistes, albums...",
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        minHeight: 52,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
      }}
    >
      <Search size={18} color={theme.colors.textMuted} />
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.body,
        }}
      >
        {placeholder}
      </Text>
    </Pressable>
  );
}
