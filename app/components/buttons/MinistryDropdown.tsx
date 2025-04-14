"use client";

import { useState, useEffect, useRef } from "react";

interface Ministry {
  ministry_id: number;
  ministryname: string;
}

interface MinistryDropdownProps {
  member_id: number;
  onUpdate?: () => void; // Add callback for parent refresh
}

export default function MinistryDropdown({ member_id, onUpdate }: MinistryDropdownProps) {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMinistries() {
      try {
        const response = await fetch("/api/ministries", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setMinistries(data);
      } catch (error) {
        console.error("Failed to load ministries", error);
      }
    }

    fetchMinistries();
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
  }, [dropdownRef]);

  async function updateAdminMinistry(ministry: Ministry) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memID: member_id, minID: ministry.ministry_id }),
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