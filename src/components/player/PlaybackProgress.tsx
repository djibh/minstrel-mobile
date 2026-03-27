import { theme } from "@/theme";
import { formatDuration } from "@/utils/formatDuration";
import { Text, View } from "react-native";

type Props = {
  progress: number;
  duration: number;
};

export function PlaybackProgress({ progress, duration }: Props) {
  const ratio = duration > 0 ? Math.min(progress / duration, 1) : 0;

  return (
    <View>
      <View
        style={{
          height: 6,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.surfaceAlt,
          overflow: "hidden",
          marginBottom: theme.spacing.sm,
        }}
      >
        <View
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            backgroundColor: theme.colors.accent,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
          }}
        >
          {formatDuration(progress)}
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
          }}
        >
          {formatDuration(duration)}
        </Text>
      </View>
    </View>
  );
}
