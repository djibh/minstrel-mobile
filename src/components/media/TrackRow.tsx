import { Track } from "@/domain/models/track.model";
import { theme } from "@/theme";
import { Play } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  track: Track;
  onPress?: () => void;
};

export function TrackRow({ track, onPress }: Props) {
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
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surfaceAlt,
        }}
      >
        <Play size={16} color={theme.colors.textSecondary} />
      </View>

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

      <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
        {track.durationLabel}
      </Text>
    </Pressable>
  );
}
