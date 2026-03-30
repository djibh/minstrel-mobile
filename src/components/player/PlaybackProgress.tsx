import { theme } from "@/theme";
import { formatDuration } from "@/utils/formatDuration";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  progress: number;
  duration: number;
  onSeek?: (seconds: number) => void;
};

export function PlaybackProgress({ progress, duration, onSeek }: Props) {
  return (
    <View>
      <SeekBar progress={progress} duration={duration} onSeek={onSeek} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: theme.spacing.sm,
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

function SeekBar({
  progress,
  duration,
  onSeek,
}: {
  progress: number;
  duration: number;
  onSeek?: (seconds: number) => void;
}) {
  const [width, setWidth] = useState(0);
  const ratio = duration > 0 ? Math.min(progress / duration, 1) : 0;

  return (
    <Pressable
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onPress={(e) => {
        if (!onSeek || duration <= 0 || width <= 0) return;

        const x = e.nativeEvent.locationX;
        const nextRatio = Math.max(0, Math.min(1, x / width));
        onSeek(duration * nextRatio);
      }}
      style={{
        height: 24,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          height: 6,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.surfaceAlt,
          overflow: "hidden",
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
    </Pressable>
  );
}
