import { Track } from "@/domain/models/track.model";
import { theme } from "@/theme";
import { Heart } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { AlbumCover } from "./AlbumCover";

type Props = {
  track: Track;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (track: Track) => void;
};

export function TrackRow({ track, onPress, isFavorite, onToggleFavorite }: Props) {
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
      <AlbumCover size={40} radius={theme.radius.sm} coverUrl={track.coverUrl} />

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{ color: theme.colors.textPrimary, fontWeight: "600" }}
        >
          {track.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{ color: theme.colors.textSecondary, fontSize: 12 }}
        >
          {track.subtitle}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
        {onToggleFavorite ? (
          <Pressable onPress={() => onToggleFavorite(track)} hitSlop={8}>
            <Heart
              size={16}
              color={isFavorite ? theme.colors.error : theme.colors.textMuted}
              fill={isFavorite ? theme.colors.error : "transparent"}
            />
          </Pressable>
        ) : null}

        <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
          {track.durationLabel}
        </Text>
      </View>
    </Pressable>
  );
}
