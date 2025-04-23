'use client';

import React, { useEffect, useState } from 'react';
import { Advocate } from '@/advocate';

function filterAdvocates(advocates: Advocate[], searchTerm: string): Advocate[] {
  const normalized = searchTerm.toLowerCase();

  return advocates.filter((advocate) =>
    advocate.firstName.toLowerCase().includes(normalized) ||
    advocate.lastName.toLowerCase().includes(normalized) ||
    advocate.city.toLowerCase().includes(normalized) ||
    advocate.degree.toLowerCase().includes(normalized) ||
    advocate.specialties?.some((s) => s.toLowerCase().includes(normalized)) ||
    String(advocate.yearsOfExperience).includes(normalized)
  );
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/advocates')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching advocates:', error);
        setErrorMessage('Failed to load advocates. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredAdvocates(filterAdvocates(advocates, searchTerm));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, advocates]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleResetSearch = (): void => {
    setSearchTerm('');
    setFilteredAdvocates(advocates);
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
          value={searchTerm}/>
        <button onClick={handleResetSearch}>Reset Search</button>
      </div>
      <br/>
      <br/>

      {isLoading ? (
        <p>Loading advocates...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : filteredAdvocates.length === 0 ? (
        <p>No advocates match your search terms.</p>
      ) : (
        <table>
          <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
          </thead>
          <tbody>
          {filteredAdvocates.map((advocate) => (
            <tr key={advocate.id + '-row'}>
              <td>{advocate.firstName}</td>
              <td>{advocate.lastName}</td>
              <td>{advocate.city}</td>
              <td>{advocate.degree}</td>
              <td>
                {Array.isArray(advocate.specialties)
                  ? advocate.specialties.map((s) => (
                    <div key={`${advocate.id}-${s}`}>{s}</div>
                  )) :
                  <div>-</div>
                }
              </td>
              <td>{advocate.yearsOfExperience}</td>
              <td>{advocate.phoneNumber}</td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
