import { Album } from "@/domain/models/album.model";
import { theme } from "@/theme";
import { Pressable, Text, View } from "react-native";

type Props = {
  album: Album;
  onPress?: () => void;
};

export function AlbumCard({ album, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={{ width: "48%" }}>
      <View
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.surfaceAlt,
          marginBottom: theme.spacing.sm,
        }}
      />
      <Text
        numberOfLines={1}
        style={{ color: theme.colors.textPrimary, fontWeight: "600" }}
      >
        {album.title}
      </Text>
      <Text
        numberOfLines={1}
        style={{ color: theme.colors.textSecondary, fontSize: 12 }}
      >
        {album.artistName}
      </Text>
    </Pressable>
  );
}
