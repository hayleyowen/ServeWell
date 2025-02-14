'use client'

import React, { useState } from 'react';

export default function UserSettingsForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted', { username, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
}