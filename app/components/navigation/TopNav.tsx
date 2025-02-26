'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMinistries } from '@/app/lib/data';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '../buttons/LogoutButton';

interface Ministry {
    ministry_id: number;
    ministryname: string;
    church_id: number;
    budget: number;
    description: string | null;
}

const TopNav = () => {
    const [customMinistries, setCustomMinistries] = useState<Ministry[]>([]);
    const pathname = usePathname();

    const fetchMinistries = async () => {
        try {
            const ministries = await getMinistries();
            setCustomMinistries(ministries);
        } catch (error) {
            console.error('Failed to fetch ministries:', error);
        }
    };

    useEffect(() => {
        fetchMinistries();
    }, [pathname]);

    return (
        <header className="fixed top-0 h-15 w-full bg-white p-4 shadow-md">
            <nav className="flex justify-between items-center">
                {/* Logo */}
                <div>
                    <Link href="/"><Image src="/logo.png" width={75} height={75} alt="Logo"/></Link>
                </div>

                {/* Ministries Navigation */}
                <div>
                    <ul className="flex space-x-4">
                        {customMinistries.map((ministry) => (
                            <li key={ministry.ministry_id} className="relative group">
                                <Link 
                                    href={`/ministry/${ministry.ministryname.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                                    className="text-gray-800 hover:text-gray-500 flex items-center"
                                >
                                    {ministry.ministryname}
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </Link>
                                {/* Dropdown */}
                                <ul className="absolute left-0 mt-2 w-40 bg-blue-700 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <li>
                                        <Link href={`/ministry/${ministry.ministryname.toLowerCase().replace(/[^a-z0-9]/g, '')}/finances`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                            Finances
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/ministry/${ministry.ministryname.toLowerCase().replace(/[^a-z0-9]/g, '')}/members`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                            Members
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/ministry/${ministry.ministryname.toLowerCase().replace(/[^a-z0-9]/g, '')}/calendar`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                            Calendar
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Add Ministry */}
                <div>
                    <Link 
                        href="/ministry-creation"
                        className="text-blue-600 hover:text-blue-400 font-medium"
                    >
                        + Add Ministry
                    </Link>
                </div>

                {/* Settings Button */}
                <div>
                    <Link 
                        href="/settings"
                        className="text-blue-600 hover:text-blue-400 font-medium"
                    >
                        Settings
                    </Link>
                </div>

                {/* Logout Button */}
                <div>
                    <LogoutButton />
                </div>            
            </nav>
        </header>
    );
};

export default TopNav;