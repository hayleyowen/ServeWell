'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function MinistryDetailsForm() {
  const [ministryName, setMinistryName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useUser(); // Get the user object from Auth0
  const auth0ID = user?.sub; // Extract the Auth0 ID from the user object

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear any previous messages

  
    try {
      const response = await fetch('/api/update-ministry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ministryName, description, auth0ID }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ministry details');
      }
  
      const data = await response.json();
      setMessage(data.message || 'Ministry details updated successfully');
      // Clear the form fields
      setMinistryName('');
      setDescription('');
      
    } catch (error: any) {
      console.error('Error updating ministry details:', error);
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ministryName" className="block text-gray-700 text-lg font-bold mb-2">Ministry Name</label>
          <input
            type="text"
            id="ministryName"
            value={ministryName}
            onChange={(e) => setMinistryName(e.target.value)}
            className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-lg font-bold mb-2">Description</label>
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
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}