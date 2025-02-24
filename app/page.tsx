import '@/app/globals.css';
import { LoginButton } from './components/buttons/LoginButton';
import { ChurchCreationButton } from './components/buttons/ChurchCreationButton';
import Image from 'next/image';
import { SuperHomepageButton } from './components/buttons/SuperHomepageButton';


export default function Home() {
  return (
    <section className="t-20 min-h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-t from-blue-300 to-blue-600 p-30">
        <div className="flex-1 flex flex-col items-center justify-center">
          <Image src="/Servewell.png" width={500} height={500} alt="Logo"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <ChurchCreationButton />
            <LoginButton />
            <SuperHomepageButton />
          </div>
        </div>
      </div>
    </section>
  );
}