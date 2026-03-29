import { PlaybackSync } from "@/components/player/PlaybackSync";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlaybackSync />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="now-playing" />
        <Stack.Screen name="album/[id]" />
        <Stack.Screen name="playlist/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}
