"use client";

import { useState, useEffect, useRef } from "react";

interface Ministry {
  ministry_id: number;
  ministryname: string;
}

interface MinistryDropdownProps {
  userID: number;
  onUpdate?: () => void; // Add callback for parent refresh
  auth0ID: string; // Add auth0ID prop
}

export default function MinistryDropdown({ userID, onUpdate }: MinistryDropdownProps) {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMinistries() {
      if (!auth0ID) return; // Don't fetch if auth0ID is not provided
      try {
        // Pass auth0ID as a query parameter
        const response = await fetch(`/api/ministries?auth0ID=${encodeURIComponent(auth0ID)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Check if the response was successful
        if (!response.ok) {
          console.error("Failed to fetch ministries, status:", response.status);
          const errorData = await response.json().catch(() => ({})); // Try to get error details
          console.error("Error details:", errorData);
          setMinistries([]); // Set to empty array on error
          return; // Stop execution
        }

        const data = await response.json();

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setMinistries(data);
        } else {
          console.error("Received non-array data for ministries:", data);
          setMinistries([]); // Set to empty array if data is not an array
        }

      } catch (error) {
        console.error("Failed to load ministries", error);
      }
    }

    fetchMinistries();
  }, [auth0ID]); // Add auth0ID to dependency array

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
  }, [dropdownRef]);

  async function updateAdminMinistry(ministry: Ministry) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: userID, minID: ministry.ministry_id }),
      });

      if (response.ok) {
        setSelectedMinistry(ministry);
        // Call the onUpdate callback if provided
        if (onUpdate) {
          onUpdate();
        } else {
          // Fallback to page reload if no callback provided
          window.location.reload();
        }
      } else {
        console.error("Error updating ministry:", await response.json());
      }
    } catch (error) {
      console.error("Failed to update ministry:", error);
    }
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? "Updating..." : "Select Ministry"}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          {ministries.map((ministry) => (
            <div
              key={ministry.ministry_id}
              onClick={() => updateAdminMinistry(ministry)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700"
            >
              {ministry.ministryname}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}