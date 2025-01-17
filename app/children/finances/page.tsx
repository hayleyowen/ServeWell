import clsx from 'clsx';
import '@/app/globals.css';

export default function FinancesTrackingPage() {
  return (
    <section className="h-screen flex flex-col">
      <div className="bg-white p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">ServeWell</h1>
      </div>
      <div className="flex-1 flex flex-col bg-blue-500">
        <div className="flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-white mb-8">Financial Tracking Homepage</h2>
        </div>
      </div>
    </section>
  );
}
