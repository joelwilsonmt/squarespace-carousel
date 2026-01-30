import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface Endorser {
  firstName: string;
  lastName: string;
  occupation: string;
  employer: string;
  formattedString: string;
}

declare global {
  interface Window {
    CSV_SOURCE_URL?: string;
    WIDGET_TITLE?: string;
  }
}

const DEFAULT_CSV_SOURCE_URL = 'https://docs.google.com/spreadsheets/d/1kI3_2ivzx-1xfuCZNgG_K7q-9Z0NEwF4zHvai10xryM/edit?usp=sharing';

function getCsvUrl(url: string): string {
  if (url.includes('docs.google.com/spreadsheets')) {
    // Convert edit/view URL to export CSV URL
    return url.replace(/\/edit.*$/, '/export?format=csv');
  }
  return url;
}

export function useEndorsements() {
  const [endorsements, setEndorsements] = useState<Endorser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sourceUrl = getCsvUrl(window.CSV_SOURCE_URL || DEFAULT_CSV_SOURCE_URL);
        
        Papa.parse(sourceUrl, {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const filtered = (results.data as any[])
              .filter((row) => {
                const codes = row['Contact Codes'] || '';
                return codes.includes('C_Endorsement');
              })
              .map((row) => {
                const toTitleCase = (str: string) => {
                  return str.toLowerCase().split(' ').map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  }).join(' ');
                };

                const firstName = toTitleCase(row['First Name'] || '');
                const lastName = toTitleCase(row['Last Name'] || '');
                let occupation = row['Occupation'] || '';
                let employer = row['Employer'] || '';

                if (occupation.toLowerCase() === 'not employed') occupation = '';
                if (employer.toLowerCase() === 'not employed') employer = '';

                let formattedString = `${firstName} ${lastName}`.trim();
                
                if (occupation) {
                  formattedString += `, ${occupation}`;
                }
                
                if (employer) {
                  formattedString += ` - ${employer}`;
                }

                return {
                  firstName,
                  lastName,
                  occupation,
                  employer,
                  formattedString,
                };
              });

            const sorted = filtered.sort((a, b) => 
              a.lastName.localeCompare(b.lastName)
            );

            setEndorsements(sorted);
            setLoading(false);
          },
          error: (err: any) => {
            console.error('PapaParse error:', err);
            setError('Failed to load endorsements');
            setLoading(false);
          },
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { endorsements, loading, error };
}
