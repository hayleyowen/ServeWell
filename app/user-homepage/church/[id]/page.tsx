import { getChurchByID } from '@/app/lib/data';
import '@/app/globals.css';

export default async function ChurchHomepage({ params }: { params: { id: string } }) {
  const churchId = await parseInt(params.id);

  try {
    const church = await getChurchByID(churchId);

    if (!church) {
      return (
        <div className="min-h-screen bg-blue-500 flex items-center justify-center">
          <div className="bg-white p-6 sm:p-8 rounded-lg">
            <h1 className="text-xl sm:text-2xl font-bold text-red-500 text-center">
              Church not found (ID: {churchId})
            </h1>
          </div>
        </div>
      );
    }

    return (
      <section className="min-h-screen flex flex-col bg-gradient-to-b from-blue-400 to-blue-600">
        <div className="flex-1 flex flex-col p-6 sm:p-40 md:p-40">
          <div className="flex flex-col items-center justify-center pt-40 sm:pt-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-4 sm:mb-8">
              {church[0].churchname} Homepage
            </h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl">
              <a href={`/user-homepage/church/${churchId}/members`} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                <h3 className="text-lg sm:text-xl font-bold mb-2">Member Tracking</h3>
              </a>
              <a href={`/user-homepage/church/${churchId}/finances`} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                <h3 className="text-lg sm:text-xl font-bold mb-2">Financial Tracking</h3>
              </a>
              <a href={`/user-homepage/church/${churchId}/calendar`} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                <h3 className="text-lg sm:text-xl font-bold mb-2">Calendar</h3>
              </a>
              <a href={`/user-homepage/church/${churchId}/media`} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                <h3 className="text-lg sm:text-xl font-bold mb-2">Media Archive</h3>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching church:', error);
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <div className="bg-white p-6 sm:p-8 rounded-lg">
          <h1 className="text-xl sm:text-2xl font-bold text-red-500 text-center">
            Error loading church
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            Please try again later
          </p>
        </div>
      </div>
    );
  }
}