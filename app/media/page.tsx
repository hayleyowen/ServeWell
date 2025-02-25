import '@/app/globals.css';

export default async function MediaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-12">Sermons & Announcements</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Latest Sermon */}
          <div className="block bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-200 ease-in-out">
            <div className="relative pt-[56.25%] mb-4">
              <iframe
                src="https://www.youtube.com/embed/latest-sermon-id"
                className="absolute top-0 left-0 w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">Latest Sunday Sermon</h2>
            <p className="text-gray-600 text-center mt-2">March 24, 2024</p>
          </div>

          {/* Weekly Announcements */}
          <div className="block bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-200 ease-in-out">
            <div className="relative pt-[56.25%] mb-4">
              <iframe
                src="https://www.youtube.com/embed/weekly-update-id"
                className="absolute top-0 left-0 w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">Weekly Announcements</h2>
            <p className="text-gray-600 text-center mt-2">March 20, 2024</p>
          </div>

          {/* Previous Sermon */}
          <div className="block bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-200 ease-in-out">
            <div className="relative pt-[56.25%] mb-4">
              <iframe
                src="https://www.youtube.com/embed/previous-sermon-id"
                className="absolute top-0 left-0 w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">Previous Sunday Sermon</h2>
            <p className="text-gray-600 text-center mt-2">March 17, 2024</p>
          </div>
        </div>
      </div>
    </main>
  );
} 