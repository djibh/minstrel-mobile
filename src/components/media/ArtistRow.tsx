import { Artist } from "@/domain/models/artist.model";
import { theme } from "@/theme";
import { Pressable, Text, View } from "react-native";

type Props = {
  artist: Artist;
  onPress?: () => void;
};

export function ArtistRow({ artist, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: theme.colors.surfaceAlt,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          {artist.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            color: theme.colors.textPrimary,
            fontWeight: "600",
            fontSize: theme.typography.rowTitle,
          }}
        >
          {artist.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.caption,
          }}
        >
          {artist.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
