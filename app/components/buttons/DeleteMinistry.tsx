'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface DeleteMinistryButtonProps {
    ministryId: string;
}

export default function DeleteMinistryButton({ ministryId }: DeleteMinistryButtonProps) {
    const { user } = useUser();
    const auth0ID = user?.sub; // Assuming the auth0ID is stored in the 'sub' field of the user object
    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this ministry?')) {
            try {
                const response = await fetch('/api/delete-ministry', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: ministryId, auth0ID }),
                });

                if (response.ok) {
                    alert('Ministry deleted successfully');
                    window.location.href = '/user-homepage'; // Redirect to the user homepage 
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error deleting ministry:', error);
                alert('An error occurred while deleting the ministry. Please try again.');
            }
        }
    };

    return (
        <button
            className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
            onClick={handleDelete}
        >
            Delete Ministry
        </button>
    );
}