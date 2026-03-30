import { RepeatMode } from "@/stores/playback.store";
import { theme } from "@/theme";
import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react-native";
import { Pressable, View } from "react-native";

type Props = {
  isPlaying: boolean;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
};

export function PlayerControls({
  isPlaying,
  repeatMode,
  shuffleEnabled,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
}: Props) {
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;

  return (
    <View
      style={{
        alignItems: "center",
        gap: theme.spacing.xl,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.xxl,
        }}
      >
        <Pressable onPress={onToggleShuffle}>
          <Shuffle
            size={20}
            color={
              shuffleEnabled ? theme.colors.accent : theme.colors.textSecondary
            }
          />
        </Pressable>

        <Pressable onPress={onPrevious}>
          <SkipBack size={28} color={theme.colors.textPrimary} />
        </Pressable>

        <Pressable
          onPress={onTogglePlayPause}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.accent,
          }}
        >
          {isPlaying ? (
            <Pause size={30} color={theme.colors.bg} />
          ) : (
            <Play size={30} color={theme.colors.bg} />
          )}
        </Pressable>

        <Pressable onPress={onNext}>
          <SkipForward size={28} color={theme.colors.textPrimary} />
        </Pressable>

        <Pressable onPress={onCycleRepeat}>
          <RepeatIcon
            size={20}
            color={
              repeatMode !== "off"
                ? theme.colors.accent
                : theme.colors.textSecondary
            }
          />
        </Pressable>
      </View>
    </View>
  );
}
