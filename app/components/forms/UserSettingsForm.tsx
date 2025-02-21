'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function UserSettingsForm() {
  const { user, error, isLoading } = useUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.nickname || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('You must be logged in to update your profile.');
      return;
    }

    try {
      const res = await fetch('/api/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.sub, // Auth0 User ID
          email: email || undefined,
          username: username || undefined,
          password: password || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('User updated successfully!');
      } else {
        setMessage(data.error?.message || 'Failed to update user.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return user ? (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-gray-800 shadow-lg rounded-xl">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-white">Change Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">Change Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white">Change Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button type="submit" className="mt-4 bg-white text-black py-2 px-4 rounded-md">Save Changes</button>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </form>
  ) : (
    <p>Please <a href="/api/auth/login" className="text-black">log in</a> to update your profile.</p>
  );
}
