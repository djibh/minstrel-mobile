export function formatDuration(seconds?: number): string {
    if (seconds == null || Number.isNaN(seconds)) return '--:--';

    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${String(remaining).padStart(2, '0')}`;
}