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
                <span className="inline-flex items-center space-x-2">
                    <h3 className="text-xl font-bold">Update Ministry Details</h3>
                    <svg
                        className={`w-6 h-6 transition-transform transform ${
                            showForm ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </span>
            </button>
            {showForm && (
                <div className="mt-4">
                    <MinistryDetailsForm />
                </div>
            )}
        </div>
    );
};