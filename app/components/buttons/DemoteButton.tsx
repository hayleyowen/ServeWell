import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';


interface DemoteButtonProps {
    userID: number;
    isSuper?: boolean;
    auth0ID?: string;
    onDemote?: () => void;
    currentUserEmail?: string;
    email?: string;
}

export default function DemoteButton({ userID, isSuper = false, auth0ID, onDemote, currentUserEmail, email }: DemoteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    
    const isSelfDemotion = currentUserEmail && email && currentUserEmail === email;

    const handleDemote = async () => {
        if (isSelfDemotion) {
            alert("You cannot remove yourself.");
            return;
        }
        
        const userType = isSuper ? 'super-admin' : 'admin';
        if (!confirm(`Are you sure you want to remove this ${userType}? They will be removed from your church.`)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/demote-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID : userID, auth0ID: auth0ID }),
            });

            if (!response.ok) {
                throw new Error(`Failed to remove ${userType}`);
            }

            alert(`Successfully removed ${userType}`);
            if (onDemote) {
                onDemote();
            }
        } catch (error) {
            console.error(`Error removing ${userType}:`, error);
            alert(`Failed to remove ${userType}`);
        } finally {
            setIsLoading(false);
        }
    };

    // If this is the current user's button, disable it and show tooltip
    if (isSelfDemotion) {
        return (
            
                <span className="inline-block">
                    <button
                        disabled
                        className="p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed ml-2 opacity-50"
                        title="Cannot remove yourself"
                    >
                        <FaTrash size={16} />
                    </button>
                </span>
        );
    }

    return (
        <button
            onClick={handleDemote}
            disabled={isLoading}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
            title="Remove admin"
        >
            {isLoading ? 
                <span className="px-1">...</span> : 
                <FaTrash size={16} />
            }
        </button>
    );
} 