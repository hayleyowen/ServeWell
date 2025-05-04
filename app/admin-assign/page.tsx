'use client'; // This must be at the top to ensure it's a client component

import '@/app/globals.css';
import DemoteButton from '../components/buttons/DemoteButton';
import StatusAssignmentDropdown from '../components/buttons/StatusAssignmentDropdown';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface Admin {
    userID: number;
    fname: string;
    email: string;
    minID: number | null;
    church_id: number | null;
    ministryname: string | null;
    isSuper?: boolean;
}

export default function AdminAssignPage() {
    const [allAdmins, setAllAdmins] = useState<Admin[]>([]);
    const { user } = useUser();
    const auth0ID = user?.sub;

    const fetchAllAdmins = async () => {
        if (!auth0ID) return;

        try {
            // Fetch requesting admins
            const adminResponse = await fetch('/api/admin/request-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ auth0ID: auth0ID }),
            });

            // Fetch super admins
            const superAdminResponse = await fetch('/api/admin/get-super-admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ auth0ID: auth0ID }),
            });

            if (!adminResponse.ok || !superAdminResponse.ok) {
                throw new Error('Failed to fetch admins');
            }

            const adminData = await adminResponse.json();
            const superAdminData = await superAdminResponse.json();

            // Combine and mark super admins
            const combinedAdmins = [
                ...superAdminData.map((admin: Admin) => ({ ...admin, isSuper: true })),
                ...adminData,
            ];

            // Sort to ensure super admins are always on top
            const sortedAdmins = combinedAdmins.sort((a, b) => {
                if (a.isSuper && !b.isSuper) return -1;
                if (!a.isSuper && b.isSuper) return 1;
                return 0;
            });

            console.log('Fetched admins:', sortedAdmins);
            setAllAdmins(sortedAdmins);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    // Set up auto-refresh interval
    useEffect(() => {
        // Initial fetch
        fetchAllAdmins();

        // Set up interval for periodic refresh (every 30 seconds)
        const intervalId = setInterval(fetchAllAdmins, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [auth0ID]);

    return (
        <section className="mt-20 min-h-screen flex flex-col">
            <div className="mt-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-6 sm:p-10 md:p-20">
                <div className="flex flex-col items-center justify-center pt-4 sm:pt-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
                        Admin Assignment Page
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-auto w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-sm sm:text-base">Name</th>
                                <th className="px-4 py-2 text-sm sm:text-base">Email</th>
                                <th className="px-4 py-2 text-sm sm:text-base">Status</th>
                                <th className="px-4 py-2 text-sm sm:text-base">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {allAdmins.length > 0 ? (
                                allAdmins.map((admin) => (
                                    <tr key={admin.userID} className="border-b">
                                        <td className="px-4 py-2 text-sm sm:text-base">{admin.fname}</td>
                                        <td className="px-4 py-2 text-sm sm:text-base">{admin.email}</td>
                                        <td className="px-4 py-2">
                                            <StatusAssignmentDropdown
                                                userID={admin.userID}
                                                fname={admin.fname}
                                                minID={admin.minID}
                                                ministryname={admin.isSuper ? 'Super Admin' : admin.ministryname}
                                                auth0ID={auth0ID || ''}
                                                onUpdate={fetchAllAdmins}
                                                isSuper={admin.isSuper}
                                            />
                                        </td>
                                        <td className="px-4 py-2 flex justify-center items-center">
                                            <DemoteButton
                                                userID={admin.userID}
                                                isSuper={admin.isSuper}
                                                onDemote={fetchAllAdmins}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-gray-500 text-sm sm:text-base">
                                        No administrators found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
