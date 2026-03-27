import { Track } from "@/domain/models/track.model";
import { theme } from "@/theme";
import { Text, View } from "react-native";

type Props = {
  tracks: Track[];
};

export function QueuePreview({ tracks }: Props) {
  return (
    <View
      style={{
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.cardTitle,
          fontWeight: "600",
          marginBottom: theme.spacing.md,
        }}
      >
        File d’attente
      </Text>

      {tracks.length === 0 ? (
        <Text style={{ color: theme.colors.textSecondary }}>
          Aucun morceau suivant.
        </Text>
      ) : (
        tracks.map((track) => (
          <View
            key={track.id}
            style={{
              paddingVertical: theme.spacing.sm,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: theme.colors.textPrimary,
                fontWeight: "600",
              }}
            >
              {track.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.caption,
              }}
            >
              {track.artistName}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
