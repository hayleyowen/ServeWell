"use client";

import { useState, useEffect, useRef } from "react";

interface Ministry {
  ministry_id: number;
  ministryname: string;
}

interface StatusAssignmentDropdownProps {
  member_id: number;
  fname: string;
  minID: number | null;
  ministryname: string | null;
  auth0ID: string; // Logged-in super admin's auth0ID
  onUpdate?: () => void; // Callback for parent refresh
  isSuper?: boolean; // Add isSuper flag
}

export default function StatusAssignmentDropdown({ 
  member_id, fname, minID, ministryname,
  auth0ID, onUpdate, isSuper = false // Default to false
}: StatusAssignmentDropdownProps) {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStatusText = ministryname || "Unassigned";

  // Fetch ministries relevant to the logged-in super admin's church
  useEffect(() => {
    async function fetchMinistries() {
      if (!auth0ID) return; 
      setLoading(true); // Start loading ministries
      try {
        const response = await fetch(`/api/ministries?auth0ID=${encodeURIComponent(auth0ID)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          console.error("Failed to fetch ministries, status:", response.status);
          const errorData = await response.json().catch(() => ({})); 
          console.error("Error details:", errorData);
          setMinistries([]); 
          return; 
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setMinistries(data);
        } else {
          console.error("Received non-array data for ministries:", data);
          setMinistries([]); 
        }

      } catch (error) {
        console.error("Failed to load ministries", error);
        setMinistries([]); // Set empty on catch
      } finally {
          setLoading(false); // Stop loading ministries
      }
    }

    fetchMinistries();
  }, [auth0ID]);

  // Handle clicks outside the dropdown
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

  // Function to assign a ministry - when clicking a ministry in the dropdown
  async function assignMinistry(ministry: Ministry) {
    setLoading(true);
    try {
      // Special handling if user is currently a super admin
      // We need to demote them first from super admin (rID=2) to regular admin (rID=1)
      // and assign ministry at the same time
      if (isSuper) {
        // Call a new API route that handles demoting and assigning in a single transaction
        const response = await fetch("/api/admin/demote-and-assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            member_id: member_id, 
            minID: ministry.ministry_id,
            auth0ID: auth0ID // Pass the current user's auth0ID
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Error demoting super admin and assigning ministry:`, errorData);
          alert(`Failed to update user. ${errorData.error || ''}`);
          setLoading(false);
          setIsOpen(false);
          return;
        }
      } else {
        // Regular admin assignment - use the existing API
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memID: member_id, minID: ministry.ministry_id }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Error assigning ministry:`, errorData);
          alert(`Failed to assign ministry. ${errorData.error || ''}`);
          setLoading(false);
          setIsOpen(false);
          return;
        }
      }
      
      // Successful assignment
      console.log(`Assigned ${fname} to ${ministry.ministryname}`);
      if (onUpdate) onUpdate(); // Refresh the parent component data
      
    } catch (error) {
      console.error("Failed to update user:", error);
      alert('An error occurred while updating the user.');
    }
    setLoading(false);
    setIsOpen(false);
  }

  // Function to promote to super admin
  async function promoteToSuperAdmin() {
    if (!confirm(`Are you sure you want to promote ${fname} to Super Admin?`)) {
        return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/promote-super-admin", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          member_id: member_id, // ID of user being promoted
          auth0ID: auth0ID       // auth0ID of the logged-in user performing the action
        })
      });

      if (response.ok) {
         console.log(`Promoted ${fname} to Super Admin`);
         alert(`Successfully promoted ${fname} to Super Admin.`);
        if (onUpdate) onUpdate();
      } else {
         const errorData = await response.json().catch(() => ({}));
        console.error(`Error promoting ${fname}:`, errorData);
         alert(`Failed to promote user. ${errorData.error || ''}`);
      }
    } catch (error) {
      console.error("Failed to promote user:", error);
       alert('An error occurred while promoting the user.');
    }
    setLoading(false);
    setIsOpen(false);
  }

  // Determine button style based on assignment or super admin status
  const buttonClass = isSuper
    ? "px-4 py-2 bg-green-500 text-white rounded-lg inline-block text-center hover:bg-green-600 transition-colors" // Super Admin (Green)
    : minID !== null
      ? "px-4 py-2 bg-green-500 text-white rounded-lg inline-block text-center hover:bg-green-600 transition-colors" // Assigned style (Green)
      : "px-4 py-2 bg-blue-500 text-white rounded-lg inline-block text-center hover:bg-blue-600 transition-colors"; // Unassigned style (Blue)

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
        disabled={loading}
      >
        {loading ? "Updating..." : currentStatusText}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
           {/* Promote Option - Only show for non-super admins */}
           {!isSuper && (
             <div
                onClick={promoteToSuperAdmin}
                className="px-4 py-2 font-bold text-black hover:bg-gray-100 cursor-pointer transition-colors"
              >
                Promote to Super Admin
              </div>
           )}

           {/* Divider - Only show if both sections are visible */}
           {!isSuper && ministries.length > 0 && <hr className="my-1" />}

           {/* Ministry Options - Filtered */}
          {ministries.length > 0 
            ? ministries
                .filter(ministry => ministry.ministry_id !== minID) // Filter out the currently assigned ministry
                .map((ministry) => (
                  <div
                    key={ministry.ministry_id}
                    onClick={() => assignMinistry(ministry)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700"
                  >
                    {ministry.ministryname} {/* Removed "Assign: " prefix */}
                  </div>
                ))
                : (
             <div className="px-4 py-2 text-gray-500 italic">No ministries found</div>
          )}
        </div>
      )}
    </div>
  );
} 