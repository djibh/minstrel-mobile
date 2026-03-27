import { apiGet } from './client';

export const searchApi = {
    search: (query: string) =>
        apiGet(`/search?q=${encodeURIComponent(query)}`),
};