import { bottomOverlaySpacing } from "@/constants/layout";
import { theme } from "@/theme";
import { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  scrollable?: boolean;
}>;

export function AppScreen({ children, scrollable = false }: Props) {
  const insets = useSafeAreaInsets();

  if (scrollable) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
      >
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
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.lg,
          paddingBottom: insets.bottom,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
