'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMinistriesByID, getUserChurch } from '@/app/lib/data';
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

interface Church {
  church_id: number;
  churchname: string;
}

const TopNav = () => {
  const [customMinistries, setCustomMinistries] = useState<Ministry[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const pathname = usePathname();
  const { user, error, isLoading } = useUser();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Fetch ministries and churches
  useEffect(() => {
    const fetchData = async () => {
      if (user?.sub) {
        try {
          setDataLoading(true); // Set loading to true before fetching data
          const auth0ID = user.sub;

          // Fetch ministries
          const ministries = await getMinistriesByID(auth0ID);
          setCustomMinistries(ministries as Ministry[]);

          // Fetch churches
          const churchData = await getUserChurch(auth0ID);
          setChurches(churchData as Church[]);
          setFetchError(null); // Clear any previous errors
        } catch (error) {
          console.error('Failed to fetch data:', error);
          setFetchError('Failed to load data. Please try again later.');
        } finally {
          setDataLoading(false); // Set loading to false after fetching data
        }
      } else {
        setCustomMinistries([]);
        setChurches([]);
        setDataLoading(false); // Set loading to false if no user is found
      }
    };

    fetchData();
  }, [user, getMinistriesByID, getUserChurch]);


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
        
                    {/* Church and Ministries Navigation */}
                    <div className="flex space-x-4">
                        {/* Church Dropdown */}
                        <ul className="list-none">
                            {churches.map((church) => (
                                <li key={church.church_id} className="relative dropdown-container">
                                    <button
                                        onClick={() => handleToggleDropdown(church.church_id)}
                                        className="text-gray-800 hover:text-gray-500 flex items-center focus:outline-none"
                                    >
                                        {church.churchname}
                                        <svg
                                            className={`ml-1 w-4 h-4 transform transition-transform ${
                                                openDropdown === church.church_id ? 'rotate-180' : 'rotate-0'
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
        
                                    {/* Dropdown - Visible only if selected */}
                                    {openDropdown === church.church_id && (
                                        <ul className="absolute left-0 mt-2 w-40 bg-blue-700 shadow-lg rounded-lg">
                                            <li>
                                                <Link href={`/user-homepage/church/${church.church_id}/`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                    Homepage
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`/user-homepage/church/${church.church_id}/finances`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                    Finances
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`/user-homepage/church/${church.church_id}/members`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                    Members
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`/user-homepage/church/${church.church_id}/calendar`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                    Calendar
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`/user-homepage/church/${church.church_id}/media`} className="block px-4 py-2 text-white rounded-lg hover:bg-blue-500">
                                                    Media
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
        
                        {/* Ministries Dropdown */}
                        <ul className="list-none flex space-x-4">
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
        
                    {/* Tools Button */}
                    <div>
                        <Link href="/tools" className="text-blue-600 hover:text-blue-400 font-medium">
                            Tools
                        </Link>
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
