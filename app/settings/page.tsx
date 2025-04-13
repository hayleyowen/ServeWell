import '@/app/globals.css';
import { AssignmentPageButton } from '../components/buttons/AssignmentPage';
import { MinistryCreationButton } from '../components/buttons/MinistryCreationButton';
import { ChurchDetailsButton } from '../components/buttons/ChurchDetailsButton';
import { MinistryDetailsButton } from '../components/buttons/MinistryDetailsButton';

export default function Settings() {
  return (
    <section className="t-20 min-h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-40">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {/* Container for Page Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mb-8">
            <AssignmentPageButton />
            <MinistryCreationButton />
          </div>

          {/* Container for Details Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
            <ChurchDetailsButton />
            <MinistryDetailsButton />
          </div>
        </div>
      </div>
    </section>
  );
}