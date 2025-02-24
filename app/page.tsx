'use client';
import '@/app/globals.css';
import { LoginButton } from './components/buttons/LoginButton';
import { ChurchCreationButton } from './components/buttons/ChurchCreationButton';
import Image from 'next/image';
import { SuperHomepageButton } from './components/buttons/SuperHomepageButton';
import  {useUser} from '@auth0/nextjs-auth0/client';
import { insertAdmins } from '../api/admin/route';



export default function Home() {
  // fetch user session
  const { user, error, isLoading } = useUser();
  console.log(user.sub);

  // take logged-in user and create an admin associated with that user
  const createAdmin = async () => {
    const response = await insertAdmins(user.sub);

    if (response.ok) {
      console.log("Admin created successfully");
    } else {
      console.error("Failed to create admin");
    }
  }
  

  // if no session (i.e. user is not logged in), show login button
  if (!user) {
    return (
      <section className="t-20 min-h-screen flex flex-col">
        <div className="t-15 flex-1 flex flex-col bg-gradient-to-t from-blue-300 to-blue-600 p-30">
          <div className="flex-1 flex flex-col items-center justify-center">
            <Image src="/Servewell.png" width={500} height={500} alt="Logo"/>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 w-full max-w-4xl">
              <LoginButton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If user session exists (i.e. user is logged in), show homepage
  return (
    <section className="t-20 min-h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-t from-blue-300 to-blue-600 p-30">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-row items-center text-center space-x-6">
            <h1 className="text-4xl font-bold text-white">Welcome, {user.nickname}</h1>
            <Image src="/Servewell.png" width={500} height={500} alt="Logo"/>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <ChurchCreationButton />
            {/* <LoginButton /> */}
            <SuperHomepageButton />
          </div>
        </div>
      </div>
    </section>
  );
}