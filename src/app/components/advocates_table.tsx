import React from 'react';
import { Advocate } from '@/advocate';
import AdvocatesFooter from '@/app/components/advocates_footer';
import AdvocatesRow from '@/app/components/advocates_row';
import AdvocatesHeader from '@/app/components/advocates_header';

type Props = {
  advocates: Advocate[];
  handlePageChange: (page: number) => void;
  handleSort: (s: string) => void;
  handleSpecialtyClick: (s: string) => void;
  page: number;
  sortDirection: 'asc' | 'desc';
  sortKey: string;
  totalPages: number | null;
  hoveredSpecialty: string | null;
  setHoveredSpecialty: (s: string | null) => void;
  highlightSearchTerm: (searchTerm: string, text: string) => React.ReactNode;
  highlightMatch: (specialty: string) => boolean;
  searchTerm: string;
};

export default function AdvocatesTable({
                                         advocates,
                                         handlePageChange,
                                         handleSort,
                                         handleSpecialtyClick,
                                         page,
                                         sortDirection,
                                         sortKey,
                                         totalPages,
                                         hoveredSpecialty,
                                         setHoveredSpecialty,
                                         highlightSearchTerm,
                                         highlightMatch,
                                         searchTerm,
                                       }: Props) {
  return (
    <div className="overflow-x-auto rounded-md shadow-sm border border-gray-200 bg-white">
      <table className="w-full table-auto text-sm">
        <AdvocatesHeader handleSort={handleSort} sortDirection={sortDirection} sortKey={sortKey}/>

        <tbody>
        {advocates.map((advocate, idx) => (
          <AdvocatesRow
            key={advocate.id ?? idx}
            advocate={advocate}
            idx={idx}
            handleSpecialtyClick={handleSpecialtyClick}
            hoveredSpecialty={hoveredSpecialty}
            setHoveredSpecialty={setHoveredSpecialty}
            highlightSearchTerm={highlightSearchTerm}
            highlightMatch={highlightMatch}
            searchTerm={searchTerm}
          />
        ))}
        </tbody>
      </table>

      <AdvocatesFooter handlePageChange={handlePageChange} page={page} totalPages={totalPages}/>
    </div>
  );
}
