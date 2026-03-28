import { theme } from "@/theme";
import { Text, View } from "react-native";

type Props = {
  size?: number | string;
  radius?: number;
  label?: string;
};

export function AlbumCover({
  size = 56,
  radius = theme.radius.md,
  label = "♪",
}: Props) {
  return (
    <View
      style={{
        width: typeof size === "number" ? size : undefined,
        height: typeof size === "number" ? size : undefined,
        aspectRatio: typeof size === "string" ? 1 : undefined,
        borderRadius: radius,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
