import { getMinistries } from '@/app/lib/data';

export default async function TestPage() {
  const ministries = await getMinistries();
  console.log('Ministries in page:', ministries);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ministry Test Page</h1>
      
      {ministries.length === 0 ? (
        <p>No ministries found in database</p>
      ) : (
        <div className="grid gap-4">
          {ministries.map((ministry) => (
            <div 
              key={ministry.ministry_id} 
              className="p-4 border rounded-lg bg-white shadow"
            >
              <h2 className="text-xl font-semibold">{ministry.ministryname}</h2>
              <p className="text-gray-600">{ministry.description || 'No description'}</p>
              <div className="mt-2 text-sm">
                <p>Church ID: {ministry.church_id}</p>
                <p>Budget: ${ministry.budget?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 