'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

type PageParams = {
  params: Promise<{ id: string }>;
};

export default function AddMediaPage({ params }: PageParams) {
  const router = useRouter();
  const resolvedParams = use(params);
  const churchId = parseInt(resolvedParams.id, 10);

  const [formData, setFormData] = useState({
    title: '',
    type: 'sermon',
    youtubeUrl: '',
    date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract video ID from YouTube URL
    const youtubeId = formData.youtubeUrl.split('v=')[1]?.split('&')[0];
    
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          youtubeId,
          churchId,
        }),
      });

      if (response.ok) {
        router.push(`/user-homepage/church/${churchId}/media`);
        router.refresh();
      } else {
        throw new Error('Failed to post media');
      }
    } catch (error) {
      console.error('Error posting media:', error);
      alert('Failed to add media. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 my-8 sm:my-10 md:my-12">
        <h1 className="text-2xl font-bold text-center mb-6">Add New Media</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="sermon">Sermon</option>
              <option value="announcement">Announcement</option>
              <option value="worship">Worship</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">
              YouTube URL
            </label>
            <input
              type="url"
              id="youtubeUrl"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              required
              placeholder="https://www.youtube.com/watch?v=..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Media
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 