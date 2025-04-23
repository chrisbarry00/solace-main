'use client';

import React, { useEffect, useState } from 'react';
import { Advocate } from '@/advocate';

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const limit = 10;
  const totalPages = totalCount ? Math.ceil(totalCount / limit) : null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortKey,
        sortDirection,
        searchTerm,
      }).toString();

      fetch(`/api/advocates?${query}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          setAdvocates(json.data);
          setTotalCount(json.totalCount ?? null);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching advocates:', error);
          setErrorMessage('Failed to load advocates. Please try again later.');
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [page, sortKey, sortDirection, searchTerm]);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleResetSearch = (): void => {
    setSearchTerm('');
    setPage(1);
  };

  return (
    <main style={{ margin: '24px' }}>
      <h1>Solace Advocates</h1>
      <br/>
      <br/>
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          onChange={handleSearchInputChange}
          style={{ border: '1px solid black' }}
          value={searchTerm}
        />
        <button onClick={handleResetSearch}>Reset Search</button>
      </div>
      <br/>
      <br/>

      {isLoading ? (
        <p>Loading advocates...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : advocates.length === 0 ? (
        <p>No advocates match your search terms.</p>
      ) : (
        <div>
          <table>
            <thead>
            <tr>
              <th onClick={() => handleSort('firstName')}>First Name</th>
              <th onClick={() => handleSort('lastName')}>Last Name</th>
              <th onClick={() => handleSort('city')}>City</th>
              <th onClick={() => handleSort('degree')}>Degree</th>
              <th>Specialties</th>
              <th onClick={() => handleSort('yearsOfExperience')}>Experience</th>
              <th>Phone</th>
            </tr>
            </thead>
            <tbody>
            {advocates.map((advocate) => (
              <tr key={`${advocate.id}-row`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {Array.isArray(advocate.specialties)
                    ? advocate.specialties.map((s) => (
                      <div key={`${advocate.id}-${s}`}>{s}</div>
                    ))
                    : <div>-</div>}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            ))}
            </tbody>
          </table>

          <div style={{ marginTop: '24px' }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span style={{ margin: '0 12px' }}>
              Page {page}{totalPages ? ` of ${totalPages}` : ''}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={totalPages !== null && page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
