import { getMinistryByName } from '@/app/lib/data';
import '@/app/globals.css';

export default async function MinistryPage({ params }: { params: { name: string } }) {
    console.log('Received params:', params.name); // Debug log
    
    try {
        const ministry = await getMinistryByName(params.name);
        
        if (!ministry) {
            console.log('Ministry not found for name:', params.name); // Debug log
            return (
                <div className="min-h-screen bg-blue-500 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg">
                        <h1 className="text-2xl font-bold text-red-500">
                            Ministry not found (Name: {params.name})
                        </h1>
                    </div>
                </div>
            );
        }

        return (
            <section className="h-screen flex flex-col">
                <div className="flex-1 flex flex-col bg-blue-500 p-20">
                    <div className="flex flex-col items-center justify-center pt-8">
                        <h2 className="text-2xl font-bold text-white mb-8">{ministry.ministryname} Homepage</h2>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                            <a href={`/ministry/${params.name}/members`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
                            </a>
                            <a href={`/ministry/${params.name}/finances`} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-bold mb-2">Financial Tracking</h3>
                            </a>
                        </div>
                    </div>
                </div>
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