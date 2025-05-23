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

  const auth0_id = user?.sub;
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!auth0_id) {
      return;
    }
    if (isLoading) {
      return;
    }

    const fetchUsers = async () => {
      if (!isLoading){
        try {
            const response = await fetch('/api/userChurch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ auth0ID: auth0_id }),
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
      }  
    };

    fetchUsers();
}, [auth0_id, isLoading]); 

  if (isLoading) {
    return null;
  }
  if (user) {
    return null;
  }

  // if no session (i.e. user is not logged in), show login button
  // if no session (i.e. user is not logged in), show login button
if (!user) {
  return (
    <section className="t-20 min-h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-30">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Image src="/Servewell.png" width={400} height={400} alt="Logo" />
            <div className="p-8 text-center text-white max-w-6xl">
              <p className="text-lg leading-relaxed">
                <span className="font-bold">Empower Your Church to Thrive with ServeWell — the Church Management Software Designed for Small Churches. </span>
                <br />
                Small churches deserve powerful tools without the heavy price tag. ServeWell is a free church management software designed to help you manage your finances, members, and schedules with ease.
                We focus on a clean, simple interface that’s easy for everyone to use, so you can spend less time figuring out software and more time focusing on ministry. We make it easy (and affordable) to make the most of what you have — so your ministry can not just survive, but grow and thrive in today’s world.
                <br />
                <span className="font-bold">Join us to get everything you need to help your church stay organized, healthy, and ready to grow.</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 w-full max-w-6xl mt-8 pb-8">
            <LoginButton />
          </div>
        </div>
      </div>
    </section>
  );
}
}
