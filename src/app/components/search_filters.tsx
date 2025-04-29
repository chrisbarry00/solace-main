import React from 'react';

type Props = {
  handleResetSearch: () => void;
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleYearsSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  yearsSearch: string;
};

export default function SearchFilters({
                                        handleResetSearch,
                                        handleSearchInputChange,
                                        handleYearsSearchInputChange,
                                        searchTerm,
                                        yearsSearch,
                                      }: Props) {
  return (
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

      <div className="flex items-center gap-4">
        <input
          type="number"
          value={yearsSearch}
          onChange={handleYearsSearchInputChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Minimum Years of Experience"
        />
      </div>
    </div>
  );
}
