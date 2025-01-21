'use client';
import { useState } from 'react';
import Link from 'next/link';
import SideNav from '@/app/components/SideNav';

const TopNav = () => {
    const [showSideNav, setSideNav] = useState(false);

    const handleClick = () => {
        setSideNav(true);
    };

    return (
        <header className="fixed top-0 w-full bg-white p-4">
            <nav className="flex justify-between items-center">
                <div> 
                    <button onClick={handleClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                    </button>
                    {showSideNav && <SideNav />}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">ServeWell</h1>
                </div>
                <div className="flex justify-between">   
                    <ul className="flex right-0 space-x-4">
                        <li>
                            <Link href="/adult" className="text-gray-800 hover:text-gray-500">Adult's Ministry</Link>
                        </li>
                        <li>
                            <Link href="/children" className="text-gray-800 hover:text-gray-500">Children's Ministry</Link>
                        </li>
                        <li>
                            <Link href="/youth" className="text-gray-800 hover:text-gray-500">Youth Ministry</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <button className="bg-blue-500 text-white text-sm rounded-lg shadow-sm px-4 p-2 transition-transform transform hover:scale-105">Sign Out</button>
                </div>            
            </nav>
        </header>
    );
};

export default TopNav;