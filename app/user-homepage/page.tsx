'use client';

import '@/app/globals.css';
import { getMinistries } from '@/app/lib/data';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { ChurchCreationButton } from '../components/buttons/ChurchCreationButton';
import AssignmentRequestButton from '../components/buttons/AssignmentRequestButton';
import Image from 'next/image';

export default function UserHomepage() {
  // fetch user session
  const { user, error, isLoading } = useUser();
  // console.log('User Sub:', user?.sub);
  const [ministries, setMinistries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // insert new users into users table if they don't already exist
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


  const auth0_id = user?.sub;
  useEffect(() => {
    if (!auth0_id) {
      return;
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/userChurch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ auth0_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user churches');
            }
            const data = await response.json();
            console.log('User Church:', data.length);
            if (data.length === 0) {
              setUsers(null);
            } else {
              const userChurch = data[0].church_id;
              setUsers(userChurch);
            }
        } catch (error) {
            console.error('Error fetching user church:', error);
            setFetchError(error);
        } finally {
            setLoading(false);
        }
    };

    fetchUsers();
}, [auth0_id]);

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

  if (users === null) {
return (
        <section className="t-20 min-h-screen flex flex-col">
          <div className="t-15 flex-1 flex flex-col bg-gradient-to-t from-blue-300 to-blue-600 p-30">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex flex-row items-center text-center space-x-6">
                <h1 className="text-4xl font-bold text-white">Welcome, {user.nickname}</h1>
                <Image src="/Servewell.png" width={500} height={500} alt="Logo"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <ChurchCreationButton />
                <AssignmentRequestButton />
              </div>
            </div>
          </div>
        </section>
      );
  }

  else {
    return (
      <main className="min-h-screen bg-gradient-to-t from-blue-300 to-blue-600 p-8 flex items-center justify-center">
        <div className="max-w-6xl w-full">
          <h1 className="text-3xl font-bold text-white text-center mb-12">User Homepage</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {ministries.map((ministry) => (
              <a 
                key={ministry.ministry_id} 
                href={`/ministry/${ministry.ministry_id}`} 
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
}