"use client";

import { useState } from "react";

export const AssignAdmins = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMinistry, setSelectedMinistry] = useState(null);

    // need to get data from the database for ministries
    


    const handleSelect = (ministry: { id: number; name: string }) => {
        setSelectedMinistry(ministry);
        setIsOpen(false);
        
        
        console.log(`Admin assigned to: ${ministry.name}`);
    };

    return (
        <div className="relative inline-block">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-blue-500 text-white p-2 rounded-lg shadow-md"
            >
                Assign Admin
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    {ministries.map((ministry) => (
                        <button
                            key={ministry.id}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            onClick={() => handleSelect(ministry)}
                        >
                            {ministry.name}
                        </button>
                    ))}
                </div>
            )}

            {selectedMinistry && (
                <p className="mt-2 text-sm text-gray-600">
                    Assigned to: {selectedMinistry.name}
                </p>
            )}
        </div>
    );
};
