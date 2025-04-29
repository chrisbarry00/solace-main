import React from 'react';

type Props = {
  handleSort: (s: string) => void;
  sortDirection: 'asc' | 'desc';
  sortKey: string;
}

export default function AdvocatesHeader({ handleSort, sortDirection, sortKey }: Props) {
  return (
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
