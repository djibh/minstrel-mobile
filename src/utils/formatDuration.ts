export function formatDuration(seconds?: number): string {
    if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return '--:--';

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);
    return `${minutes}:${String(remaining).padStart(2, '0')}`;
}
