import MinistryCreationForm from './components/MinistryCreationForm'
import '@/app/globals.css';

export default function MinistryCreationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
      <MinistryCreationForm />
    </main>
  );
}