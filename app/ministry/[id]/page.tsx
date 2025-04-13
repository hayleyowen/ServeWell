import { getMinistryByID } from '@/app/lib/data';
import '@/app/globals.css';
import DeleteMinistryButton from '@/app/components/buttons/DeleteMinistry';

export default async function MinistryPage({ params }: { params: { id: string } }) {
    const ministryId = params.id;
    console.log('Received params:', ministryId);

    try {
        const ministry = await getMinistryByID(parseInt(ministryId));
        console.log('Fetched ministry:', ministry);

        if (!ministry) {
            console.log('Ministry not found for ID:', ministryId);
            return (
                <div className="min-h-screen bg-blue-500 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg">
                        <h1 className="text-2xl font-bold text-red-500">
                            Ministry not found (ID: {ministryId})
                        </h1>
                    </div>
                </div>
            );
        }

        return (
            <section className="t-20 min-h-screen flex flex-col">
                <div className="t-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-30">
                    <div className="flex flex-col items-center justify-center pt-8">
                        <h2 className="text-2xl font-bold text-white mb-8">{ministry.ministryname} Homepage</h2>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                            <a href={`/ministry/${ministryId}/members`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
                            </a>
                            <a href={`/ministry/${ministryId}/finances`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-bold mb-2">Financial Tracking</h3>
                            </a>
                            <a href={`/ministry/${ministryId}/calendar`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-bold mb-2">Calendar</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <DeleteMinistryButton ministryId={ministryId} />
            </section>
        );
    } catch (error) {
        console.error('Error fetching ministry:', error);
        return (
            <div className="min-h-screen bg-blue-500 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg">
                    <h1 className="text-2xl font-bold text-red-500">
                        Error loading ministry
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Please try again later
                    </p>
                </div>
            </div>
        );
    }
} 