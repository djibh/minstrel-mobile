import { theme } from "@/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Download, Home, Library, Search } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const icons = {
  home: Home,
  library: Library,
  search: Search,
  offline: Download,
};

const labels = {
  home: "Accueil",
  library: "Biblio",
  search: "Recherche",
  offline: "Offline",
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.bgElevated,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        paddingBottom: 20,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const Icon = icons[route.name as keyof typeof icons];
        const label = labels[route.name as keyof typeof labels] ?? route.name;

        if (!Icon) return null;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <View
              style={{
                minWidth: 52,
                height: 36,
                paddingHorizontal: 10,
                borderRadius: theme.radius.md,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isFocused
                  ? theme.colors.accentSoft
                  : "transparent",
              }}
            >
              <Icon
                size={18}
                color={isFocused ? theme.colors.accent : theme.colors.textMuted}
              />
            </View>

            <Text
              style={{
                color: isFocused
                  ? theme.colors.textPrimary
                  : theme.colors.textMuted,
                fontSize: 11,
                fontWeight: isFocused ? "700" : "500",
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
