import { useCallback, useState } from 'react';

export function useSelectionMode<T extends string>() {
    const [selectedIds, setSelectedIds] = useState<Set<T>>(new Set());

    const toggle = useCallback((id: T) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const clear = useCallback(() => setSelectedIds(new Set()), []);

    const selectAll = useCallback((ids: T[]) => {
        setSelectedIds(new Set(ids));
    }, []);

    const isSelected = useCallback(
        (id: T) => selectedIds.has(id),
        [selectedIds],
    );

    return {
        selectedIds,
        count: selectedIds.size,
        isActive: selectedIds.size > 0,
        toggle,
        clear,
        selectAll,
        isSelected,
    };
}
