'use client';
import '@/app/globals.css';
import { LoginButton } from './components/buttons/LoginButton';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';


export default function Home() {
  // fetch user session
  const { user, error, isLoading } = useUser();
  const router = useRouter();

    // Redirect logged-in users to the user-homepage
    useEffect(() => {
      if (user) {
        router.push('/user-homepage');
      }
    }, [user, router]);
    
  // // insert new users into users table if they don't already exist
  // useEffect(() => {
  //   if (user) {
  //     const insertUser = async () => {
  //       try {
  //         await fetch('/api/admin/insert-admins', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ nickname: user.nickname, auth0_id: user.sub, email: user.email }),
  //         });
  //       } catch (err) {
  //         console.error('Failed to insert new user:', err);
  //       }
  //     };
  //     insertUser();
  //   }
  // }, [user]);

  const auth0_id = user?.sub;
  const [users, setUsers] = useState([]);
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
            if (data.length === 0) {
              setUsers(null);
            } else {
              const userChurch = data[0].church_id;
              setUsers(userChurch);
            }
        } catch (error) {
            console.error('Error fetching user church:', error);
        }
    };

    fetchUsers();
}, [auth0_id]); 

  // if no session (i.e. user is not logged in), show login button
  if (!user) {
    return (
      <section className="t-20 min-h-screen flex flex-col">
        <div className="t-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-30">
          <div className="flex-1 flex flex-col items-center justify-center">
            <Image src="/Servewell.png" width={500} height={500} alt="Logo"/>
            <div className="grid grid-cols-1 gap-8 w-full max-w-4xl">
              <LoginButton />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
