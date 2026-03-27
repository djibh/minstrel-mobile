import { theme } from "@/theme";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, left, right }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: theme.spacing.xxl,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", gap: theme.spacing.md }}>
        {left}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.screenTitle,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.body,
                marginTop: 4,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {right}
    </View>
  );
}
