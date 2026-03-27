import { theme } from "@/theme";
import { Pressable, Text, View } from "react-native";

type Option = { label: string; value: string };

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function SegmentedControl({ value, options, onChange }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: 4,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: theme.radius.md,
              backgroundColor: selected
                ? theme.colors.surfaceAlt
                : "transparent",
            }}
          >
            <Text
              style={{
                color: selected
                  ? theme.colors.textPrimary
                  : theme.colors.textSecondary,
                fontSize: theme.typography.caption,
                fontWeight: "600",
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
