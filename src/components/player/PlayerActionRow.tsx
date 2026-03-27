import { theme } from "@/theme";
import { Download, Heart, ListMusic } from "lucide-react-native";
import { Text, View } from "react-native";

export function PlayerActionRow() {
  const actions = [
    { label: "Favori", icon: Heart },
    { label: "Offline", icon: Download },
    { label: "File", icon: ListMusic },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <View
            key={action.label}
            style={{
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.surfaceAlt,
              }}
            >
              <Icon size={18} color={theme.colors.textPrimary} />
            </View>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.caption,
              }}
            >
              {action.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
