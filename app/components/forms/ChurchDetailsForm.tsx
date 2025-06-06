'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getUserChurch } from '@/app/lib/data';

export default function ChurchDetailsForm() {
  const { user } = useUser();
  const [churchID, setChurchID] = useState<number | null>(null);
  const [churchName, setChurchName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [city, setCity] = useState('');
  const [denomination, setDenomination] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const auth0ID = user?.sub;

  useEffect(() => {
    const fetchChurchId = async () => {
      if (user?.sub) {
        try {
          const userChurch = await getUserChurch(user.sub);

          if (userChurch && userChurch[0]?.church_id) {
            setChurchID(userChurch[0].church_id); // Set as number
          } else {
            console.warn('No churchID found in the response');
          }
        } catch (error) {
          console.error('Error fetching church ID:', error);
        }
      }
    };

    fetchChurchId();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear any previous messages

    if (!churchID) {
      setMessage('Unable to update church details. Church ID is missing.');
      return;
    }

    try {
      const response = await fetch('/api/update-church', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          churchID, // Include churchID in the payload
          churchName,
          denomination,
          email,
          phone,
          address,
          postalcode,
          city,
          auth0ID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update church details');
        return;
      }

      const data = await response.json();
      setMessage(data.message || 'Church details updated successfully');
      alert (data.message || 'Church details updated successfully');
      // Clear the form fields
      setChurchName('');
      setPhone('');
      setAddress('');
      setPostalcode('');
      setCity('');
      setDenomination('');
      setEmail('');
    } catch (error: any) {
      console.error('Error updating church details:', error);
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="churchName" className="block text-gray-700 text-lg font-bold mb-2">Church Name</label>
          <input
            type="text"
            id="churchName"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-gray-700 text-lg font-bold mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-gray-700 text-lg font-bold mb-2">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="postalcode" className="block text-gray-700 text-lg font-bold mb-2">Postal Code</label>
          <input
            type="text"
            id="postalcode"
            value={postalcode}
            onChange={(e) => setPostalcode(e.target.value)}
            className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-gray-700 text-lg font-bold mb-2">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="denomination" className="block text-gray-700 text-lg font-bold mb-2">Denomination</label>
          <input
            type="text"
            id="denomination"
            value={denomination}
            onChange={(e) => setDenomination(e.target.value)}
            className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded bg-gray-100 text-gray-700"
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