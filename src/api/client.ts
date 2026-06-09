const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(err?.error ?? `API error: ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(err?.error ?? `API error: ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export async function apiDelete(path: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
}