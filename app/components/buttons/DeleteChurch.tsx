'use client';

import { useState } from 'react';

interface DeleteChurchButtonProps {
    churchId: number;
}

export default function DeleteChurchButton({ churchId }: DeleteChurchButtonProps) {
    console.log("DeleteChurchButton received churchId:", churchId); // Debug log

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this church?')) {
            try {
                console.log("Sending delete request for churchId:", churchId); // Debug log
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
                    console.error("Error response from API:", errorData); // Debug log
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