'use client';

export default function DeleteMinistryButton({ ministryName }: { ministryName: string }) {
    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this ministry?')) {
            try {
                const response = await fetch('/api/delete-ministry', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: ministryName }),
                });

                if (response.ok) {
                    alert('Ministry deleted successfully');
                    window.location.href = '/user-homepage'; // Redirect to the homepage or another page
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
            className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
            onClick={handleDelete}
        >
            Delete Ministry
        </button>
    );
}