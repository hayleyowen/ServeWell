'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMinistriesByID } from '@/app/lib/data';
import Spinner from '@/app/components/spinner/spinner';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '../buttons/LogoutButton';
import { useUser } from '@auth0/nextjs-auth0/client';

interface Ministry {
    ministry_id: number;
    ministryname: string;
    church_id: number;
    budget: number;
    description: string | null;
}

const TopNav = () => {
    const {user, isLoading } = useUser();
    console.log('Users AuthID:', user?.sub);
    const [customMinistries, setCustomMinistries] = useState<Ministry[]>([]);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const fetchMinistries = async () => {
            if (user?.sub) {
                try {
                    const auth0ID = user.sub;
                    const ministries = await getMinistriesByID(auth0ID);
                    setCustomMinistries(ministries as Ministry[]);
                } catch (error) {
                    console.error('Failed to fetch ministries:', error);
                }
            } else {
                setCustomMinistries([]);
            }
        };

        fetchMinistries();
    }, [user, pathname]);

    // Toggle dropdown visibility
    const handleToggleDropdown = (ministryId: number) => {
        setOpenDropdown(openDropdown === ministryId ? null : ministryId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (isLoading) {
        return <Spinner />;
    }
    if (!user) {
        return (<div> </div>)
    }
    else {
        return (
            <header className="fixed top-0 h-15 w-full bg-white p-4 shadow-md z-50">
                <nav className="flex justify-between items-center">
                    {/* Logo */}
                    <div>
                        <Link href={"/user-homepage"}>
                            <Image src="/logo.png" width={75} height={75} alt="Logo" />
                        </Link>
                    </div>
    
                    {/* Ministries Navigation */}
                    <div>
                        <ul className="flex space-x-4">
                        {customMinistries.map((ministry) => (
                            <li key={ministry.ministry_id} className="relative dropdown-container">
                                <button
                                    onClick={() => handleToggleDropdown(ministry.ministry_id)}
                                    className="text-gray-800 hover:text-gray-500 flex items-center focus:outline-none"
                                >
                                    {ministry.ministryname}
                                    <svg
                                        className={`ml-1 w-4 h-4 transform transition-transform ${
                                            openDropdown === ministry.ministry_id ? 'rotate-180' : 'rotate-0'
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                {/* Dropdown - Visible only if selected */}
                                {openDropdown === ministry.ministry_id && (
                                    <ul className="absolute left-0 mt-2 w-40 bg-blue-700 shadow-lg rounded-lg">
                                        <li>
                                            <Link href={`/ministry/${ministry.ministry_id}/`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                Homepage
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={`/ministry/${ministry.ministry_id}/finances`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                Finances
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={`/ministry/${ministry.ministry_id}/members`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                Members
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={`/ministry/${ministry.ministry_id}/calendar`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                Calendar
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        ))}
                        </ul>
                    </div>
    
                    {/* Logout Button */}
                    <div>
                        <LogoutButton />
                    </div>            
                </nav>
            </header>
        );
    }
};   

export default TopNav;
