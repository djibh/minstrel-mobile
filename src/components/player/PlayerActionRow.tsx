import { useFavorites } from "@/hooks/useFavorites";
import { usePlaybackStore } from "@/stores/playback.store";
import { theme } from "@/theme";
import { Download, Heart, ListMusic } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function PlayerActionRow() {
  const currentTrack = usePlaybackStore((state) => state.currentTrack);
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorite = currentTrack ? isFavorite(currentTrack.id) : false;

  const actions = [
    {
      label: "Favori",
      icon: Heart,
      active: favorite,
      activeColor: theme.colors.error,
      onPress: () => {
        if (currentTrack) toggleFavorite(currentTrack);
      },
    },
    {
      label: "Offline",
      icon: Download,
      active: false,
      activeColor: theme.colors.accent,
      onPress: () => {},
    },
    {
      label: "File",
      icon: ListMusic,
      active: false,
      activeColor: theme.colors.accent,
      onPress: () => {},
    },
  ];

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {actions.map((action) => {
        const Icon = action.icon;
        const iconColor = action.active
          ? action.activeColor
          : theme.colors.textPrimary;

        return (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            style={{ alignItems: "center", gap: 8 }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: action.active
                  ? "rgba(248, 113, 113, 0.15)"
                  : theme.colors.surfaceAlt,
              }}
            >
              <Icon
                size={18}
                color={iconColor}
                fill={action.active && action.label === "Favori" ? iconColor : "transparent"}
              />
            </View>
            <Text
              style={{
                color: action.active
                  ? action.activeColor
                  : theme.colors.textSecondary,
                fontSize: theme.typography.caption,
              }}
            >
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
