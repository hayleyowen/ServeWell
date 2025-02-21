import React from 'react';

interface CheckSuperAdminProps {
    username: string;
    password: string;
}

export const CheckSuperAdmin: React.FC<CheckSuperAdminProps> = ({ username, password }) => {
    const handleClick = () => {
        // Handle the login logic here using the username and password
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleClick}
        >
            Sign In
        </button>
    );
};