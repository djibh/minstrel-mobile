import { LibrarySort } from "@/stores/library.store";
import { theme } from "@/theme";
import { ArrowDownZA, ArrowUpAZ, Calendar, Clock } from "lucide-react-native";
import { Pressable } from "react-native";

const DEFAULT_CYCLE: LibrarySort[] = ["recent", "alpha", "alpha-desc"];

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  recent: Clock,
  alpha: ArrowUpAZ,
  "alpha-desc": ArrowDownZA,
  year: Calendar,
};

type Props = {
  value: LibrarySort;
  onChange: (next: LibrarySort) => void;
  cycle?: LibrarySort[];
};

export function SortButton({ value, onChange, cycle = DEFAULT_CYCLE }: Props) {
  const current = cycle.includes(value) ? value : cycle[0];

  const handlePress = () => {
    const nextIndex = (cycle.indexOf(current) + 1) % cycle.length;
    onChange(cycle[nextIndex]);
  };

  const Icon = ICON_MAP[current] ?? Clock;

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
