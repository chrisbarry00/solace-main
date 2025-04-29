import { useEffect, useState } from 'react';
import { Advocate } from '@/advocate';

type UseAdvocatesOptions = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  yearsSearch?: string;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
};

export function useAdvocates({
                               page = 1,
                               limit = 10,
                               searchTerm = '',
                               yearsSearch = '',
                               sortKey = 'lastName',
                               sortDirection = 'asc',
                             }: UseAdvocatesOptions = {}) {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdvocates() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (yearsSearch) params.append('yearsSearch', yearsSearch);
        if (sortKey) params.append('sortKey', sortKey);
        if (sortDirection) params.append('sortDirection', sortDirection);

        const res = await fetch(`/api/advocates?${params.toString()}`);

        if (!res.ok) {
          throw new Error('Failed to fetch advocates');
        }

        const json = await res.json();
        setAdvocates(json.data || []);
        setTotalCount(json.totalCount || 0);
      } catch (err: any) {
        setErrorMessage(err.message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdvocates();
  }, [page, limit, searchTerm, yearsSearch, sortKey, sortDirection]);

  return {
    advocates,
    totalCount,
    isLoading,
    errorMessage,
  };
}
