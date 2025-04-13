"use client";

import { useState } from 'react';
import ChurchDetailsForm from '../forms/ChurchDetailsForm';

export const ChurchDetailsButton = () => {
    const [showForm, setShowForm] = useState(false);

    const handleButtonClick = () => {
        setShowForm((prev) => !prev);
    };

    return (
        <div className="text-center w-full">
            <button
                onClick={handleButtonClick}
                className="bg-white p-6 rounded-lg shadow-lg text-center w-full transition-transform transform hover:scale-105"
            >
                <h3 className="text-xl font-bold mb-2">Update Church Details</h3>
            </button>
            {showForm && (
                <div className="mt-4">
                    <ChurchDetailsForm />
                </div>
            )}
        </div>
    );
};