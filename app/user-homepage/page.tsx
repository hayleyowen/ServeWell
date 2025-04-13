'use client';

import '@/app/globals.css';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getMinistriesByID, getUserChurch } from '@/app/lib/data';
import { usePathname } from 'next/navigation';

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
  const { user, isLoading } = useUser();
  const [customMinistries, setCustomMinistries] = useState<Ministry[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const pathname = usePathname();

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
          setChurches(churchData as Church[]); // Assuming churchData is an array of churches
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      } else {
        setCustomMinistries([]);
        setChurches([]);
      }
    };

    fetchData();
  }, [user, pathname]);

  return (
    <section className="t-20 min-h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-40">
        <div className="flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-white mb-8">Homepage</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-wrap gap-4 w-full max-w-4xl justify-center">
              {customMinistries.map((ministry) => (
                <a
                  key={ministry.ministry_id}
                  href={`/ministry/${ministry.ministry_id}`}
                  className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 w-full h-20 flex items-center justify-center"
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