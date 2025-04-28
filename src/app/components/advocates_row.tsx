import React, { useState } from 'react';
import { Advocate } from '@/advocate';

type Props = {
  advocate: Advocate;
  handleSpecialtyClick: (s: string) => void;
  idx: number;
}

export default function AdvocatesRow({ advocate, handleSpecialtyClick, idx }: Props) {
  const [hoveredSpecialty, setHoveredSpecialty] = useState<string | null>(null);

  const highlightMatch = (specialty: string) =>
    hoveredSpecialty === specialty;

  const formatPhoneNumber = (phone: number): string => {
    const digits = phone.toString();
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  return (
    <tr
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
      <td className="px-3 py-2">{advocate.yearsOfExperience} years</td>
      <td className="px-3 py-2 font-medium text-blue-700 whitespace-nowrap">
        {formatPhoneNumber(advocate.phoneNumber)}
      </td>
    </tr>
  );
}
