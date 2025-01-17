import '@/app/globals.css';
import { getChurches } from '@/app/lib/data';

export default async function dbTestingPage() {
    const churches = await getChurches();
    return (
    <section className="h-screen flex flex-col">
        <div className="bg-white p-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">ServeWell</h1>
        </div>
        <div className="flex-1 flex flex-col bg-blue-500">
            <div className="flex flex-col items-center justify-center pt-8">
                <h2 className="text-2xl font-bold text-white mb-8">Database Testing Page</h2>
            </div>
        </div>
        <div>
            {churches.map((id) => (
                <div key={id.name}>
                    <h3>{id.name}</h3>
                    <p>{id.address}</p>
                    <p>{id.city}, {id.postalcode}</p>
                    <p>{id.phone}</p>
                </div>
            ))}
        </div>  
    </section>
    );
    }