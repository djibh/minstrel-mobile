import { theme } from "@/theme";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import { Pressable, View } from "react-native";

type Props = {
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function PlayerControls({
  isPlaying,
  onTogglePlayPause,
  onNext,
  onPrevious,
}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.xxl,
      }}
    >
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
    </View>
  );
}
