import { AppScreen } from "@/components/layout/AppScreen";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { theme } from "@/theme";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function AlbumDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <AppScreen>
      <ScreenHeader title="Album" />
      <Text style={{ color: theme.colors.textSecondary }}>Album ID : {id}</Text>
    </AppScreen>
  );
}
