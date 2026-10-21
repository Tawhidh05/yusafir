import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from './client';

/** Thin wrapper so every page fetches the same way; params are part of the cache key. */
export function useApi(key, url, params, options = {}) {
  return useQuery({
    queryKey: [key, url, params ?? null],
    queryFn: async () => (await api.get(url, { params })).data,
    ...options,
  });
}

export const useTableApi = (key, url, params) => useApi(key, url, params, { placeholderData: keepPreviousData });

export const useDestinations = (params = { limit: 12 }) => useApi('destinations', '/destinations', params, { staleTime: 5 * 60_000 });
