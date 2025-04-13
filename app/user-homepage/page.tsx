'use client';

import '@/app/globals.css';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getMinistriesByID, getUserChurch } from '@/app/lib/data';
import { usePathname } from 'next/navigation';
import { ChurchCreationButton } from '../components/buttons/ChurchCreationButton';
import AssignmentRequestButton from '../components/buttons/AssignmentRequestButton';
import Image from 'next/image';

interface Ministry {
  ministry_id: number;
  ministryname: string;
  church_id: number;
  budget: number;
  description: string | null;
}

interface Church {
  church_id: number;
  churchname: string;
}

export default function UserHomepage() {
  const [customMinistries, setCustomMinistries] = useState<Ministry[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, error, isLoading } = useUser();

  // Insert new users into the database
  useEffect(() => {
    if (user) {
      const insertUser = async () => {
        try {
          await fetch('/api/admin/insert-admins', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: user.nickname, auth0_id: user.sub, email: user.email }),
          });
        } catch (err) {
          console.error('Failed to insert new user:', err);
        }
      };
      insertUser();
    }
  }, [user]);

  // Fetch ministries and churches
  useEffect(() => {
    const fetchData = async () => {
      if (user?.sub) {
        try {
          const auth0ID = user.sub;

          // Fetch ministries
          const ministries = await getMinistriesByID(auth0ID);
          setCustomMinistries(ministries as Ministry[]);

          // Fetch churches
          const churchData = await getUserChurch(auth0ID);
          setChurches(churchData as Church[]);
          setFetchError(null); // Clear any previous errors
        } catch (error) {
          console.error('Failed to fetch data:', error);
          setFetchError('Failed to load data. Please try again later.');
        }
      } else {
        setCustomMinistries([]);
        setChurches([]);
      }
    };

    fetchData();
  }, [user, getMinistriesByID, getUserChurch]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{fetchError}</p>
      </main>
    );
  }

  return (
    <section className="t-20 min-h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-40">
        <div className="flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-white mb-8">
            {churches.length > 0
              ? `${churches[0].churchname} Homepage`
              : 'Homepage'}
          </h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-wrap gap-4 w-full max-w-4xl justify-center">
              {customMinistries.map((ministry) => (
                <a
                  key={ministry.ministry_id}
                  href={`/ministry/${ministry.ministry_id}`}
                  className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 w-full h-20 flex items-center justify-center"
                  aria-label={`View details for ministry ${ministry.ministryname}`}
                >
                  <h3 className="text-xl font-bold mb-2">{ministry.ministryname}</h3>
                </a>
              ))}
              {churches.map((church) => (
                <a
                  key={church.church_id}
                  href={`/user-homepage/church/${church.church_id}`}
                  className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 w-full h-20 flex items-center justify-center"
                >
                  <h3 className="text-xl font-bold mb-2">{church.churchname}</h3>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}