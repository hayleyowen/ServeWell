import clsx from 'clsx';
import '@/app/globals.css';

export default function AdultHomepage() {
  return (
    <section className="t-20 h-screen flex flex-col">
      <div className="flex-1 flex flex-col bg-blue-500 p-20">
        <div className="flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-white mb-8">Adult's Minsitry Homepage</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <a href="adult/members" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
            </a>
            <a href="adult/finances" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Financial Tracking</h3>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}