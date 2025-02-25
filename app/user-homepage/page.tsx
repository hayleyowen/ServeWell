import clsx from 'clsx';
import '@/app/globals.css';
import { getMinistries } from '@/app/lib/data';

export default async function UserHomepage() {
  const ministries = await getMinistries();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-8 flex items-center justify-center">
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