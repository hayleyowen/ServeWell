import { getChurchByID } from '@/app/lib/data';
import '@/app/globals.css';
import DeleteChurchButton from '@/app/components/buttons/DeleteChurch';

export default async function ChurchHomepage({ params }: { params: { id: string } }) {
  const churchId = await parseInt(params.id);

  try {
    const church = await getChurchByID(churchId);

    if (!church) {
      return (
        <div className="min-h-screen bg-blue-500 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h1 className="text-2xl font-bold text-red-500">
              Church not found (ID: {churchId})
            </h1>
          </div>
        </div>
      );
    }

    return (
      <section className="t-20 min-h-screen flex flex-col">
        <div className="t-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-30">
          <div className="flex flex-col items-center justify-center pt-8"></div>
          <h2 className="text-2xl font-bold flex-row text-white mb-8">{church[0].churchname} Homepage</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              <a href={`/user-homepage/church/${churchId}/members`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
              </a>
              <a href={`/user-homepage/church/${churchId}/finances`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                <h3 className="text-xl font-bold mb-2">Financial Tracking</h3>
              </a>
              <a href="/media" className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                <h3 className="text-xl font-bold mb-2">Media Archive</h3>
              </a>
            </div>
          </div>
        </div>
        <DeleteChurchButton churchId={churchId} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching church:', error);
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-red-500">
            Error loading church
          </h1>
          <p className="mt-2 text-gray-600">
            Please try again later
          </p>
        </div>
      </div>
    );
  }
}