'use client';

import { useState, useEffect, useRef } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';

interface Church {
  church_id: number;
  churchname: string;
}

export default function AssignmentRequestButton() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const auth0ID = user?.sub;

  useEffect(() => {
    async function fetchChurches() {
      try {
        const response = await fetch("/api/churches", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setChurches(data);
      } catch (error) {
        console.error("Failed to load churches", error);
      }
    }

    fetchChurches();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function deletePreviousRequest() {
    if (!selectedChurch) return; // No previous request to delete

    try {
      const response = await fetch("/api/requestingAdmins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ churchID: selectedChurch.church_id, auth0ID }),
      });

      if (!response.ok) {
        console.error("Failed to delete previous request");
      }
    } catch (error) {
      console.error("Error deleting previous request:", error);
    }
  }

  async function updateRequestAdmin(church: Church) {
    if (selectedChurch?.church_id === church.church_id) {
      console.warn("A request has already been made for this church.");
      return; // Prevent duplicate requests for the same church
    }

    setLoading(true);
    try {
      // Delete the previous request before sending a new one
      await deletePreviousRequest();

      const response = await fetch("/api/requestingAdmins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ churchID: church.church_id, auth0ID }),
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedChurch(church); // Update the selected church
      } else {
        console.error("Error updating requesting admin", data.error);
      }
    } catch (error) {
      console.error("Failed to update requesting admin", error);
    }
    setLoading(false);
  }

  return (
    <div
      ref={dropdownRef}
      className="relative bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 w-full h-16 sm:h-18 md:h-20 flex items-center justify-center"
    >
      <button
        className="w-full h-full flex justify-center items-center"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        <h3 className="text-xl font-bold mb-2">
          {loading
            ? "Updating..."
            : selectedChurch
            ? `Request Sent to ${selectedChurch.churchname}`
            : "Request Assignment"}
        </h3>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {churches.length > 0 ? (
            churches.map((church) => (
              <div
                key={church.church_id}
                className={`p-3 hover:bg-blue-100 cursor-pointer text-gray-700 text-sm sm:text-base ${
                  selectedChurch?.church_id === church.church_id ? "bg-blue-200" : ""
                }`}
                onClick={() => {
                  updateRequestAdmin(church);
                  setIsOpen(false);
                }}
              >
                {church.churchname}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-sm sm:text-base">No churches available</div>
          )}
        </div>
      )}
    </div>
  );
}