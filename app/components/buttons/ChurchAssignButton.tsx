"use client";

import { useState, useEffect, useRef } from "react";

interface Church {
  church_id: number;
}


export default function ChurchDropdown() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, [dropdownRef]);

  async function requestChurchAssign(church: Church) {
    setLoading(true);

    const member_id = await fetch("/api/admin", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ church_id: church.church_id, member_id: member_id }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedChurch(church);
      } else {
        console.error("Error updating user church:", data.error);
      }
    } catch (error) {
      console.error("Failed to update user church:", error);
    }
    setLoading(false);
  }

  return (
    <div className="relative inline-block text-left mb-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? "Updating..." : selectedMinistry ? selectedMinistry.ministryname : "Select Ministry"}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {ministries.map((ministry) => (
            <div
              key={ministry.ministry_id}
              onClick={() => {
                requestChurchAssign(church.church_id);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {ministry.ministryname}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};