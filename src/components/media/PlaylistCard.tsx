import { Playlist } from "@/domain/models/playlist.model";
import { theme } from "@/theme";
import { Pressable, Text, View } from "react-native";

type Props = {
  playlist: Playlist;
  onPress?: () => void;
};

export function PlaylistCard({ playlist, onPress }: Props) {
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
          width: 56,
          height: 56,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surfaceAlt,
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            color: theme.colors.textPrimary,
            fontWeight: "600",
            fontSize: theme.typography.rowTitle,
          }}
        >
          {playlist.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.caption,
          }}
        >
          {playlist.subtitle}
        </Text>
      </View>

      {playlist.isOfflineAvailable ? (
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: theme.radius.pill,
            backgroundColor: theme.colors.accentSoft,
          }}
        >
          <Text
            style={{
              color: theme.colors.accent,
              fontSize: 11,
              fontWeight: "600",
            }}
          >
            Offline
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
