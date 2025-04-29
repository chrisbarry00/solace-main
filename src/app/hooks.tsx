import { useEffect, useState } from 'react';

import { Advocate } from '@/advocate';

export function useAdvocates({ page = 1, pageSize = 10, searchTerm = '', sortKey = '' } = {}) {
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
        params.append('pageSize', pageSize.toString());
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (sortKey) params.append('sortKey', sortKey);

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
  }, [page, pageSize, searchTerm, sortKey]);

  return {
    advocates,
    totalCount,
    isLoading,
    errorMessage,
  };
}
