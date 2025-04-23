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
  const [hoveredSpecialty, setHoveredSpecialty] = useState<string | null>(null);

  const limit = 10;
  const totalPages = totalCount ? Math.ceil(totalCount / limit) : null;

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortKey,
        sortDirection,
        searchTerm,
      }).toString();

      fetch(`/api/advocates?${query}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setPage(1);
    setSortKey('lastName');
    setSortDirection('asc');
  };

  const handleSpecialtyClick = (specialty: string) => {
    setSearchTerm(specialty);
    setPage(1);
  };

  const highlightMatch = (specialty: string) =>
    hoveredSpecialty === specialty;

  const formatPhoneNumber = (phone: number): string => {
    const digits = phone.toString();
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 bg-gray-50 text-gray-800 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-900">Solace Advocates</h1>

      <div className="mb-8 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Search</label>
        <div className="flex items-center gap-4">
          <input
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Search advocates..."
          />
          <button
            onClick={handleResetSearch}
            className="text-sm px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 shadow"
          >
            Reset
          </button>
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600">
            Searching for: <span className="font-medium text-blue-800">{searchTerm}</span>
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : advocates.length === 0 ? (
        <p className="text-gray-500">No advocates match your search terms.</p>
      ) : (
        <div className="overflow-x-auto rounded-md shadow-sm border border-gray-200 bg-white">
          <table className="w-full table-auto text-sm">
            <thead className="bg-blue-50 text-gray-900 border-b border-gray-200 whitespace-nowrap">
            <tr>
              <SortableHeader label="First Name" field="firstName" sortKey={sortKey} sortDirection={sortDirection}
                              onSort={handleSort}/>
              <SortableHeader label="Last Name" field="lastName" sortKey={sortKey} sortDirection={sortDirection}
                              onSort={handleSort}/>
              <SortableHeader label="City" field="city" sortKey={sortKey} sortDirection={sortDirection}
                              onSort={handleSort}/>
              <SortableHeader label="Degree" field="degree" sortKey={sortKey} sortDirection={sortDirection}
                              onSort={handleSort}/>
              <th className="px-3 py-2 text-left font-semibold">Specialties</th>
              <SortableHeader label="Experience" field="yearsOfExperience" sortKey={sortKey}
                              sortDirection={sortDirection} onSort={handleSort}/>
              <SortableHeader label="Phone" field="phoneNumber" sortKey={sortKey} sortDirection={sortDirection}
                              onSort={handleSort}/>
            </tr>
            </thead>
            <tbody>
            {advocates.map((advocate, idx) => (
              <tr
                key={`${advocate.id}-row`}
                className={`border-b border-gray-100 hover:bg-blue-50 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-3 py-2">{advocate.firstName}</td>
                <td className="px-3 py-2">{advocate.lastName}</td>
                <td className="px-3 py-2">{advocate.city}</td>
                <td className="px-3 py-2">{advocate.degree}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(advocate.specialties) && advocate.specialties.length > 0 ? (
                      [...advocate.specialties]
                        .sort((a, b) => a.localeCompare(b))
                        .map((s) => (
                          <span
                            key={`${advocate.id}-${s}`}
                            className={`px-2 py-1 rounded-full text-xs border cursor-pointer transition-colors duration-150 ${
                              highlightMatch(s)
                                ? 'bg-blue-100 text-blue-800 border-blue-400'
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300'
                            }`}
                            onClick={() => handleSpecialtyClick(s)}
                            onMouseEnter={() => setHoveredSpecialty(s)}
                            onMouseLeave={() => setHoveredSpecialty(null)}
                          >
                              {s}
                            </span>
                        ))
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">{advocate.yearsOfExperience}</td>
                <td className="px-3 py-2 font-medium text-blue-700 whitespace-nowrap">
                  {formatPhoneNumber(advocate.phoneNumber)}
                </td>
              </tr>
            ))}
            </tbody>
          </table>

          <div className="mt-6 p-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 text-sm border rounded disabled:opacity-50 bg-white hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page}
              {totalPages ? ` of ${totalPages}` : ''}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={totalPages !== null && page >= totalPages}
              className="px-3 py-2 text-sm border rounded disabled:opacity-50 bg-white hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

type SortableHeaderProps = {
  label: string;
  field: string;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
};

function SortableHeader({ label, field, sortKey, sortDirection, onSort }: SortableHeaderProps) {
  const isActive = sortKey === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="px-3 py-2 text-left cursor-pointer hover:underline whitespace-nowrap"
    >
      {label}
      {isActive && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
    </th>
  );
}
