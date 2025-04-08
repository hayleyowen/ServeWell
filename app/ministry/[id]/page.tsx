import { getMinistryByID } from '@/app/lib/data';
import '@/app/globals.css';
import DeleteMinistryButton from '@/app/components/buttons/DeleteMinistry';

export default async function MinistryPage({ params }: { params: { id: string } }) {
    const ministryId = params.id;
    console.log('Received params:', ministryId);

    try {
        const ministry = await getMinistryByID(parseInt(ministryId));

        if (!ministry) {
            console.log('Ministry not found for ID:', ministryId);
            return (
                <div className="text-center p-4">
                    <h1 className="text-2xl font-bold text-red-500">Ministry not found</h1>
                </div>
            );
        }

        return (
            <section className="min-h-screen bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">{ministry.ministryname}</h1>
                        <p className="text-gray-600 mt-2">{ministry.description || 'No description available'}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center px-4">
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
            <div className="text-center p-4">
                <h1 className="text-2xl font-bold text-red-500">Error loading ministry</h1>
            </div>
        );
    }
} 