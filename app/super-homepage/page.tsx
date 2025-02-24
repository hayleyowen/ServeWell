import '@/app/globals.css';
import { AssignmentPageButton } from '../components/buttons/AssignmentPage';

export default function SuperUserHomepage() {
  return (
    <section className="t-20 min-h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-t from-blue-300 to-blue-600 p-30">
        <div className="flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-white mb-8">SuperUser Homepage</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <AssignmentPageButton />
          </div>
        </div>
      </div>
    </section>
  );
}