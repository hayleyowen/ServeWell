import { getMinistryByID } from '@/app/lib/data';
import '@/app/globals.css';
import DeleteMinistryButton from '@/app/components/buttons/DeleteMinistry';

export default async function MinistryPage({ params }: { params: { id: string } }) {
    console.log('Received params:', params.id);
    
    try {
        const ministry = await getMinistryByID(parseInt(params.id));
        
        if (!ministry) {
            console.log('Ministry not found for ID:', params.id);
            return (
                <div className="min-h-screen bg-blue-500 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg">
                        <h1 className="text-2xl font-bold text-red-500">
                            Ministry not found (ID: {params.id})
                        </h1>
                    </div>
                </div>
            );
        }

        return (
            <section className="min-h-screen flex flex-col relative pt-16">
                <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-600 to-blue-300">
                    <div className="text-center py-8">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            {ministry.ministryname}'s Homepage
                        </h1>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                            <a href={`/ministry/${params.id}/members`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
                            </a>
                            <a href={`/ministry/${params.id}/finances`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-bold mb-2">Financial Tracking</h3>
                            </a>
                            <a href={`/ministry/${params.id}/calendar`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-bold mb-2">Calendar</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <DeleteMinistryButton ministryId={params.id} />
            </section>
        );
    } catch (error) {
        console.error('Error in MinistryPage:', error);
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