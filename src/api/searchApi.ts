import { SearchResultsDto } from '@/domain/dto/search.dto';
import { apiGet } from './client';

export const searchApi = {
    search: (query: string) =>
        apiGet<SearchResultsDto>(`/search?q=${encodeURIComponent(query)}`),
};