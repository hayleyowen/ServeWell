import clsx from 'clsx';
import '@/app/globals.css';

export default function YouthHomepage() {
  return (
    <section className="h-screen flex flex-col">
      <div className="bg-white p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">ServeWell</h1>
      </div>
      <div className="flex-1 flex flex-col bg-blue-500">
        <div className="flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-white mb-8">Youth Ministry Homepage</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <a href="youth/members" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
            </a>
            <a href="youth/finances" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Financial Tracking</h3>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}