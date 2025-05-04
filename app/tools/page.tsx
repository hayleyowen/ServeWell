'use client';

import '@/app/globals.css';
import { AssignmentPageButton } from '../components/buttons/AssignmentPage';
import { MinistryCreationButton } from '../components/buttons/MinistryCreationButton';
import { ChurchDetailsButton } from '../components/buttons/ChurchDetailsButton';
import { MinistryDetailsButton } from '../components/buttons/MinistryDetailsButton';
import DeleteChurchButton from '@/app/components/buttons/DeleteChurch';
import { getUserChurch } from '@/app/lib/data';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Settings() {
  const { user } = useUser();
  const [churchId, setChurchId] = useState<number | null>(null);

  useEffect(() => {
      const fetchChurchId = async () => {
          if (user?.sub) {
              try {
                  const userChurch = await getUserChurch(user.sub);
  
                  if (userChurch && userChurch[0]?.church_id) {
                      setChurchId(userChurch[0].church_id); // Set as number
                  } else {
                      console.warn("No churchID found in the response");
                  }
              } catch (error) {
                  console.error("Error fetching church ID:", error);
              }
          }
      };
  
      fetchChurchId();
  }, [user]);

  return (
    <section className="t-20 min-h-screen flex flex-col">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 p-40">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {/* Container for Page Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mb-8">
            <AssignmentPageButton />
            <MinistryCreationButton />
          </div>

          {/* Container for Details Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mb-8">
            <ChurchDetailsButton />
            <MinistryDetailsButton />
          </div>

          {/* Delete Church Button */}
          <div className="w-full max-w-4xl mt-8">
            {churchId && <DeleteChurchButton churchId={parseInt(churchId, 10)} />}
          </div>
        </div>
      </div>
    </section>
  );
}