type DebugPayload = Record<string, unknown> | undefined;

function formatPayload(payload?: DebugPayload) {
    if (!payload) {
        return '';
    }

    const entries = Object.entries(payload).filter(([, value]) => value !== undefined);
    if (entries.length === 0) {
        return '';
    }

    return ` ${JSON.stringify(Object.fromEntries(entries))}`;
}

export function logPlayerDebug(event: string, payload?: DebugPayload) {
    if (!__DEV__) {
        return;
    }

    console.log(`[player] ${event}${formatPayload(payload)}`);
}
