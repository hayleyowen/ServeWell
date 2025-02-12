import '@/app/globals.css';
import { AssignmentPage } from '../components/buttons/AssignmentPage';

export default function Home() {
  return (
    <section className="t-20 h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-blue-500 p-20">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <AssignmentPage />
            <a href="/ministry-creation" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Minsitry Creation</h3>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}