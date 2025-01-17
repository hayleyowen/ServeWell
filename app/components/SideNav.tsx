'use client';
import Link from 'next/link';

const SideNav = () => {
  return (
    <nav className="w-64 fixed top-20 left-0 h-full bg-blue-300 p-4">
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
  );
};

export default SideNav;