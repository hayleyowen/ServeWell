"use client";

import { useState } from 'react';
import MinistryDetailsForm from '../forms/MinistryDetailsForm';

export const MinistryDetailsButton = () => {
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
                <h3 className="text-xl font-bold mb-2">Update Ministry Details</h3>
            </button>
            {showForm && (
                <div className="mt-4">
                    <MinistryDetailsForm />
                </div>
            )}
        </div>
    );
};