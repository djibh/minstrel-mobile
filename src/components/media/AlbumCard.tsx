import { Album } from "@/domain/models/album.model";
import { theme } from "@/theme";
import { Pressable, Text } from "react-native";
import { AlbumCover } from "./AlbumCover";

type Props = {
  album: Album;
  onPress?: () => void;
};

export function AlbumCard({ album, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={{ width: "48%" }}>
      <AlbumCover size="100%" radius={theme.radius.lg} />

      <Text
        numberOfLines={1}
        style={{
          color: theme.colors.textPrimary,
          fontWeight: "600",
          fontSize: theme.typography.cardTitle,
        }}
      >
        {album.title}
      </Text>

      <Text
        numberOfLines={1}
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.caption,
        }}
      >
        {album.artistName}
      </Text>
    </Pressable>
  );
}
