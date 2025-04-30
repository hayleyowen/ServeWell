'use client';

import { useState } from 'react';

interface DeleteChurchButtonProps {
    churchId: string;
}

export default function DeleteChurchButton({ churchId }: DeleteChurchButtonProps) {
    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this church?')) {
            try {
                const response = await fetch('/api/delete-church', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: churchId }),
                });

                if (response.ok) {
                    alert('Church deleted successfully');
                    window.location.href = '/user-homepage'; // Redirect to the user homepage 
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error deleting church:', error);
                alert('An error occurred while deleting the church. Please try again.');
            }
        }
    };

    return (
        <button
            className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
            onClick={handleDelete}
        >
            Delete Church
        </button>
    );
}