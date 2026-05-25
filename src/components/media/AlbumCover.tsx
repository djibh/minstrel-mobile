import { theme } from "@/theme";
import { Music2 } from "lucide-react-native";
import { Image, View } from "react-native";

type Props = {
  size?: number | string;
  radius?: number;
  coverUrl?: string | null;
};

export function AlbumCover({
  size = 56,
  radius = theme.radius.md,
  coverUrl,
}: Props) {
  const resolvedSize = typeof size === "number" ? size : undefined;

  const containerStyle = {
    width: resolvedSize,
    height: resolvedSize,
    aspectRatio: typeof size === "string" ? 1 : undefined,
    borderRadius: radius,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    overflow: "hidden" as const,
  };

  if (coverUrl) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: coverUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    );
  }

  const iconSize = resolvedSize ? Math.round(resolvedSize * 0.4) : 22;

  return (
    <View style={containerStyle}>
      <Music2 size={iconSize} color={theme.colors.textMuted} strokeWidth={1.5} />
    </View>
  );
}
