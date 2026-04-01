import { theme } from "@/theme";
import { formatDuration } from "@/utils/formatDuration";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  progress: number;
  duration: number;
  onSeek?: (seconds: number) => void;
};

export function PlaybackProgress({ progress, duration, onSeek }: Props) {
  const safeProgress = Number.isFinite(progress) && progress >= 0 ? progress : 0;
  const safeDuration = Number.isFinite(duration) && duration >= 0 ? duration : 0;

  return (
    <View>
      <SeekBar progress={safeProgress} duration={safeDuration} onSeek={onSeek} />

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
          {formatDuration(safeProgress)}
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
          }}
        >
          {formatDuration(safeDuration)}
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
  const pressableRef = useRef<View>(null);
  const ratio =
    duration > 0 && Number.isFinite(progress / duration)
      ? Math.min(progress / duration, 1)
      : 0;

  return (
    <Pressable
      ref={pressableRef}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onPress={(e) => {
        if (!onSeek || duration <= 0 || width <= 0) return;

        pressableRef.current?.measure((_, __, measuredWidth, ___, pageX) => {
          const effectiveWidth = measuredWidth > 0 ? measuredWidth : width;
          if (effectiveWidth <= 0) return;

          const relativeX = e.nativeEvent.pageX - pageX;
          const nextRatio = Math.max(0, Math.min(1, relativeX / effectiveWidth));
          const nextTime = duration * nextRatio;
          onSeek(Number.isFinite(nextTime) ? nextTime : 0);
        });
      }}
      style={{
        height: 24,
        justifyContent: "center",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          height: 6,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.surfaceAlt,
          overflow: "hidden",
        }}
      >
        <View
          pointerEvents="none"
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
