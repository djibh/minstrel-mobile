import { theme } from "@/theme";
import { Search, X } from "lucide-react-native";
import { Pressable, TextInput } from "react-native";

type Props = {
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  onPress?: () => void;
  editable?: boolean;
  onClear?: () => void;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Rechercher morceaux, artistes, albums...",
  onPress,
  editable = true,
  onClear,
}: Props) {
  const isInteractivePressOnly = !!onPress && !editable;

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

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        editable={!isInteractivePressOnly && editable}
        style={{
          flex: 1,
          color: theme.colors.textPrimary,
          fontSize: theme.typography.body,
          paddingVertical: 0,
        }}
      />

      {value ? (
        <Pressable onPress={onClear}>
          <X size={18} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}
