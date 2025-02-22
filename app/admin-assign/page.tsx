'use client'; // This must be at the top to ensure it's a client component

import '@/app/globals.css';
import MinistryDropdown from '../components/buttons/MinistryDropdown';
import { useEffect, useState } from 'react';

export default function AdminAssignPage() {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await fetch('/api/admin/update-ministry', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch admins');
                }

                const data = await response.json();
                console.log('Fetched admins:', data);
                setAdmins(data);
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };

        fetchAdmins();
    }, []);

    return (
        <section className="mt-20 min-h-screen flex flex-col">
            <div className="mt-15 flex-1 flex flex-col bg-gradient-to-t from-blue-300 to-blue-600 p-30">
                <div className="flex flex-col items-center justify-center pt-8">
                    <h2 className="text-2xl font-bold text-white mb-8">Admin Assignment Page</h2>
                </div>
                <div className="items-center justify-center">
                    <table className="table-auto flex-initial w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Assignment Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {admins.length > 0 ? (
                                admins.map((admin) => (
                                    <tr key={admin.member_id}>
                                        <td>{admin.fname}</td>
                                        <td>{admin.lname}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.memberphone}</td>
                                        <td>
                                            {admin.ministry_id ? (
                                                "Assigned"
                                            ) : (
                                                <MinistryDropdown member_id={admin.member_id} />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-gray-500">No unassigned admins found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
