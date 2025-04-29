'use client';

import React, { useState } from 'react';
import AdvocatesTable from '@/app/components/advocates_table';
import SearchFilters from '@/app/components/search_filters';
import { useAdvocates } from '@/app/hooks';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearsSearch, setYearsSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [hoveredSpecialty, setHoveredSpecialty] = useState<string | null>(null);

  const { advocates, totalCount, isLoading, errorMessage } = useAdvocates({
    page,
    searchTerm,
    yearsSearch,
    sortKey,
    sortDirection,
  });

  const totalPages = totalCount ? Math.ceil(totalCount / 10) : null;

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

  const handleYearsSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYearsSearch(e.target.value);
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setYearsSearch('');
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

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 bg-gray-50 text-gray-800 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-900">Solace Advocates</h1>

      <SearchFilters
        handleResetSearch={handleResetSearch}
        handleSearchInputChange={handleSearchInputChange}
        handleYearsSearchInputChange={handleYearsSearchInputChange}
        searchTerm={searchTerm}
        yearsSearch={yearsSearch}
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
          page={page}
          totalPages={totalPages}
          sortKey={sortKey}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handlePageChange={setPage}
          handleSpecialtyClick={handleSpecialtyClick}
          hoveredSpecialty={hoveredSpecialty}
          setHoveredSpecialty={setHoveredSpecialty}
          highlightMatch={highlightMatch}
          highlightSearchTerm={highlightSearchTerm}
          searchTerm={searchTerm}
        />
      )}
    </main>
  );
}

function highlightSearchTerm(searchTerm: string, text: string) {
  if (!searchTerm) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();

  const matchIndex = lowerText.indexOf(lowerSearch);
  if (matchIndex === -1) return <>{text}</>;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + searchTerm.length);
  const after = text.slice(matchIndex + searchTerm.length);

  return (
    <>
      {before}
      <span style={{ backgroundColor: 'yellow' }}>{match}</span>
      {after}
    </>
  );
}
