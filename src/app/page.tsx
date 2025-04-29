'use client';

import React, { useState } from 'react';
import AdvocatesTable from '@/app/components/advocates_table';
import SearchFilters from '@/app/components/search_filters';
import { useAdvocates } from '@/app/hooks';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { advocates, totalCount, isLoading, errorMessage } = useAdvocates({ page, searchTerm, sortKey });

  const limit = 10;
  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0;

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

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 bg-gray-50 text-gray-800 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-900">Solace Advocates</h1>

      <SearchFilters
        handleResetSearch={handleResetSearch}
        handleSearchInputChange={handleSearchInputChange}
        searchTerm={searchTerm}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : advocates.length === 0 ? (
        <p className="text-gray-500">No advocates match your search terms.</p>
      ) : (
        <AdvocatesTable
          advocates={advocates}
          handlePageChange={setPage}
          handleSort={handleSort}
          handleSpecialtyClick={handleSpecialtyClick}
          page={page}
          sortDirection={sortDirection}
          sortKey={sortKey}
          totalPages={totalPages}
        />
      )}
    </main>
  );
}
