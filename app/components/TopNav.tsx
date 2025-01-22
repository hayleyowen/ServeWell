import Link from 'next/link';

const TopNav = () => {
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
                            <li className="group">
                                <Link href="/adult" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Adult's Ministry</Link>
                                <ul className="pl-4 space-y-2 hidden group-hover:block">
                                    <li>
                                        <Link href="/adult/finances" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Finances</Link>
                                    </li>
                                    <li>
                                        <Link href="/adult/members" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Members</Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="group">
                                <Link href="/children" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Children's Ministry</Link>
                                <ul className="pl-4 space-y-2 hidden group-hover:block">
                                    <li>
                                        <Link href="/children/finances" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Finances</Link>
                                    </li>
                                    <li>
                                        <Link href="/children/members" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Members</Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="group">
                                <Link href="/youth" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Youth Ministry</Link>
                                <ul className="pl-4 space-y-2 hidden group-hover:block">
                                    <li>
                                        <Link href="/youth/finances" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Finances</Link>
                                    </li>
                                    <li>
                                        <Link href="/youth/members" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Members</Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="group">
                                <Link href="/" className="text-white block py-2 px-4 rounded hover:bg-blue-500">Settings</Link>
                            </li>
                        </ul>
                    </nav>
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