import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { theme } from "@/theme";
import { Text } from "react-native";

export default function HomeScreen() {
  return (
    <AppScreen>
      <ScreenHeader title="Accueil" />
      <Text style={{ color: theme.colors.textSecondary }}>À venir.</Text>
    </AppScreen>
  );
}
