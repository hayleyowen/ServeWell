import React from 'react';

const MediaPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/church-worship.jpg")'
          }}
        />
        <div className="relative z-10 text-center">
          <h1 className="text-white text-5xl font-bold uppercase tracking-wider">
            Sermons & Announcements
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-green-600 mb-12">
          Watch Our Latest Services and Updates
        </h2>
        
        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Latest Sermon */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="relative pt-[56.25%]">
              <iframe
                src="https://www.youtube.com/embed/latest-sermon-id"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Latest Sunday Sermon
              </h3>
              <p className="text-gray-600">
                "Walking in Faith" - Pastor John Doe<br />
                March 24, 2024
              </p>
            </div>
          </div>

          {/* Weekly Announcements */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="relative pt-[56.25%]">
              <iframe
                src="https://www.youtube.com/embed/weekly-update-id"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Weekly Announcements
              </h3>
              <p className="text-gray-600">
                Stay updated with this week's church events and activities<br />
                March 20, 2024
              </p>
            </div>
          </div>

          {/* Previous Sermon */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="relative pt-[56.25%]">
              <iframe
                src="https://www.youtube.com/embed/previous-sermon-id"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Previous Sunday Sermon
              </h3>
              <p className="text-gray-600">
                "The Power of Community" - Pastor John Doe<br />
                March 17, 2024
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MediaPage; 