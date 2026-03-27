import { theme } from "@/theme";
import { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

type Props = PropsWithChildren<{ scrollable?: boolean }>;

export function AppScreen({ children, scrollable = false }: Props) {
  if (scrollable) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            paddingBottom: 140,
          }}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.lg,
          paddingBottom: 140,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
