'use client';

import '@/app/globals.css';
import { getMinistries } from '@/app/lib/data';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

export default function UserHomepage() {
  // fetch user session
  const { user, error, isLoading } = useUser();
  console.log('User:', user);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const data = await getMinistries();
        setMinistries(data);
      } catch (err) {
        console.error('Failed to fetch ministries:', err);
        setFetchError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, []);

  if (isLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load ministries. Please try again later.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-t from-blue-300 to-blue-600 p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-12">User Homepage</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {ministries.map((ministry) => (
            <a 
              key={ministry.ministry_id} 
              href={`/ministry/${ministry.url_path}`} 
              className="block bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <h2 className="text-xl font-semibold text-gray-800 text-center">{ministry.ministryname}</h2>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}