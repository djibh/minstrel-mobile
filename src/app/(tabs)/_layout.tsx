import { BottomTabBar } from "@/components/navigation/BottomTabBar";
import { MiniPlayer } from "@/components/navigation/MiniPlayer";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="library" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="offline" />
      </Tabs>

      <MiniPlayer />
    </>
  );
}
