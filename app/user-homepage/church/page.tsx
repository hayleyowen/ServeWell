import clsx from 'clsx';
import '@/app/globals.css';

export default function ChurchHomepage() {
  return (
    <section className="t-20 min-h-screen flex flex-col pt-20">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-t from-blue-300 to-blue-600 p-30">
        <div className="flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-white mb-8">Church Homepage</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <a href="church/members" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
            </a>
            <a href="church/finances" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Financial Tracking</h3>
            </a>
            <a href="/media" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Media Archive</h3>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}