import { LibrarySort } from "@/stores/library.store";
import { theme } from "@/theme";
import { ArrowDownZA, ArrowUpAZ, Clock } from "lucide-react-native";
import { Pressable } from "react-native";

type SortCycleMode = "recent" | "alpha" | "alpha-desc";

const CYCLE: SortCycleMode[] = ["recent", "alpha", "alpha-desc"];

type Props = {
  value: LibrarySort;
  onChange: (next: SortCycleMode) => void;
};

export function SortButton({ value, onChange }: Props) {
  const current = CYCLE.includes(value as SortCycleMode)
    ? (value as SortCycleMode)
    : "recent";

  const handlePress = () => {
    const nextIndex = (CYCLE.indexOf(current) + 1) % CYCLE.length;
    onChange(CYCLE[nextIndex]);
  };

  const Icon =
    current === "alpha"
      ? ArrowUpAZ
      : current === "alpha-desc"
        ? ArrowDownZA
        : Clock;

  const isActive = current !== "recent";

  return (
    <Pressable
      onPress={handlePress}
      style={{
        width: 40,
        height: 40,
        borderRadius: theme.radius.sm,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isActive
          ? theme.colors.accentSoft
          : theme.colors.surfaceAlt,
      }}
    >
      <Icon
        size={18}
        color={isActive ? theme.colors.accent : theme.colors.textSecondary}
      />
    </Pressable>
  );
}
