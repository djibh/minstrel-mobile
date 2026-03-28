import { bottomOverlaySpacing } from "@/constants/layout";
import { theme } from "@/theme";
import { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

type Props = PropsWithChildren<{
  scrollable?: boolean;
}>;

export function AppScreen({ children, scrollable = false }: Props) {
  if (scrollable) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            paddingBottom: bottomOverlaySpacing,
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
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
