'use client'

import Link from 'next/link';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { getMinistries } from '@/app/lib/data';
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
    }, []);

    return (
        <header className="fixed top-0 h-15 w-full bg-white p-4">
            <nav className="flex justify-between items-center">
                <div className="group"> 
                    <button className="h-15">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                    </button>
                    <nav className="w-64 fixed top-15 left-0 h-screen bg-blue-300 p-0 hidden group-hover:block">
                        <ul className="space-y-4">
                            <li className="group">
                                <Link href="/" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Home</Link>
                            </li>
                            {customMinistries.map((ministry) => (
                                <li key={ministry.ministry_id} className="group">
                                    <Link 
                                        href={`/ministry/${ministry.ministryname.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
                                        className="text-white block py-2 px-4 rounded hover:bg-blue-500"
                                    >
                                        {ministry.ministryname}
                                    </Link>
                                    <ul className="pl-4 space-y-2 hidden group-hover:block">
                                        <li>
                                            <Link 
                                                href={`/ministry/${ministry.ministryname.toLowerCase().replace(/[^a-z0-9]/g, '')}/finances`} 
                                                className="text-white block py-2 px-4 rounded hover:bg-blue-500"
                                            >
                                                Finances
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href={`/ministry/${ministry.ministryname.toLowerCase().replace(/[^a-z0-9]/g, '')}/members`} 
                                                className="text-white block py-2 px-4 rounded hover:bg-blue-500"
                                            >
                                                Members
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            ))}
                            <li className="group">
                                <Link href="/settings" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Settings</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <Link href="/"><Image src="/logo.png" width={75} height={75} alt="Logo"/></Link>
                </div>
                <div className="flex justify-between">   
                    <ul className="flex right-0 space-x-4">

                        {customMinistries.map((ministry) => (
                            <li key={ministry.ministry_id}>
                                <Link 
                                    href={`/ministry/${ministry.ministryname.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                                    className="text-gray-800 hover:text-gray-500"
                                >
                                    {ministry.ministryname}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <Link 
                        href="/ministry-creation"
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        + Add Ministry
                    </Link>
                </div>
                <div>
                    <LogoutButton />
                </div>            
            </nav>
        </header>
    );
};

export default TopNav;