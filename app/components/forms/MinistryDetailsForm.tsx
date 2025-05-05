'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getMinistriesByID } from '@/app/lib/data';

export default function MinistryDetailsForm() {
  const { user } = useUser();
  const [ministries, setMinistries] = useState<{ ministry_id: number; ministryname: string }[]>([]);
  const [selectedMinistryId, setSelectedMinistryId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [ministryName, setMinistryName] = useState('');

  useEffect(() => {
    const fetchMinistries = async () => {
      if (user?.sub) {
        try {
          const ministriesData = await getMinistriesByID(user.sub);
          setMinistries(ministriesData);
        } catch (error) {
          console.error('Error fetching ministries:', error);
        }
      }
    };

    fetchMinistries();
  }, [user]);


// Update the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage(null); // Clear any previous messages

  if (!selectedMinistryId) {
    setMessage('Please select a ministry.');
    return;
  }

  try {
    const response = await fetch('/api/update-ministry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ministryId: selectedMinistryId, description, ministryName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update ministry details');
    }

    const data = await response.json();
    setMessage(data.message || 'Ministry details updated successfully. Refreshing...');
    
    // Clear the form fields
    setSelectedMinistryId(null);
    setDescription('');
    setMinistryName('');

    // Refresh the page to reflect changes
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Optional delay to show the success message before refreshing
  } catch (error: any) {
    console.error('Error updating ministry details:', error);
    setMessage(error.message || 'An error occurred');
  }
};

return (
  <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="relative">
          <label htmlFor="ministryName" className="block text-gray-700 text-lg font-bold mb-2">
            Select Ministry to Update
          </label>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex justify-between items-center"
          >
            <span>
              {selectedMinistryId
                ? ministries.find((ministry) => ministry.ministry_id === selectedMinistryId)?.ministryname || 'Select a ministry'
                : 'Select a ministry'}
            </span>
            <svg
              className={`w-5 h-5 transition-transform transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
              {ministries.map((ministry) => (
                <div
                  key={ministry.ministry_id}
                  onClick={() => {
                    setSelectedMinistryId(ministry.ministry_id);
                    setMinistryName(ministry.ministryname); // Set the ministry name when selected
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-blue-500 hover:text-white cursor-pointer transition-all duration-200 text-gray-700"
                >
                  {ministry.ministryname}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="ministryNameInput" className="block text-gray-700 text-lg font-bold mb-2">
          Ministry Name
        </label>
        <input
          id="ministryNameInput"
          type="text"
          value={ministryName}
          onChange={(e) => setMinistryName(e.target.value)}
          className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-700 text-lg font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
          rows={4}
          required
        />
      </div>
      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        Save Changes
      </button>
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </form>
  </div>
);