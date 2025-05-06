'use client';
import '@/app/globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

type MediaItem = {
  id: number;
  title: string;
  type: 'sermon' | 'announcement' | 'worship';
  youtube_id: string;
  date: string;
  description: string;
};

type PageParams = {
  params: Promise<{ id: string }>;
};

export default function MediaPage({ params }: PageParams) {
  const resolvedParams = use(params);
  const churchId = resolvedParams.id;
  const { user } = useUser();
  const auth0ID = user?.sub;
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sermon' | 'announcement' | 'worship' | 'other'>('all');

  useEffect(() => {
    if (churchId) {
      fetchMedia();
    }
  }, [churchId]);

  const fetchMedia = async () => {
    try {
      const data = await fetch(`/api/media?churchId=${churchId}`).then(res => res.json());
      setMediaItems(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this media?')) {
      try {
        const response = await fetch(`/api/media/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ auth0ID, id })
        });
        
        if (response.ok) {
          setMediaItems(prevItems => prevItems.filter(item => item.id !== id));
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting media:', error);
        alert('Failed to delete media');
      }
    }
  };

  const filteredMedia = mediaItems.filter(item => 
    filter === 'all' ? true : item.type === filter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Media Archive</h1>
          <Link 
            href={`/user-homepage/church/${churchId}/media/add`}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            + Add Media
          </Link>
        </div>

        {/* Filter Buttons */}
        <div className="grid grid-cols-5 gap-2 mb-6 w-full max-w-3xl">
          {['all', 'sermon', 'announcement', 'worship', 'other'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                filter === type 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-lg shadow-lg p-6 h-[300px]">
                <div className="bg-gray-200 h-48 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMedia.map((item) => (
              <div 
                key={item.id} 
                className="group block bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-200 ease-in-out relative"
              >
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white opacity-0 
                           group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center
                           hover:bg-red-600 z-10"
                >
                  ×
                </button>

                <div className="relative pt-[56.25%] mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${item.youtube_id}`}
                    className="absolute top-0 left-0 w-full h-full rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-gray-600 text-center">
                  {formatDate(item.date)}
                </p>
                <h2 className="text-gray-800 text-center mt-2">{item.title}</h2>
                <div className="mt-2 flex justify-center">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    item.type === 'sermon' 
                      ? 'bg-blue-100 text-blue-600' 
                      : item.type === 'worship'
                      ? 'bg-purple-100 text-purple-600'
                      : item.type === 'announcement'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 