import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

interface DemoteButtonProps {
    userID: number;
    isSuper?: boolean;
    onDemote?: () => void;
}

export default function DemoteButton({ userID, isSuper = false, onDemote }: DemoteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDemote = async () => {
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
                body: JSON.stringify({ userID }),
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