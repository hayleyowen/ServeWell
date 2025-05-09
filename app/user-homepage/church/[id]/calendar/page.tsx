"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import "@/app/globals.css";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import Tooltip from "@mui/material/Tooltip";


export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
    const [isEditing, setIsEditing] = useState(false);
    const params = useParams();
    const { id } = useParams(); // `id` should be from the dynamic route /church/[id]/calendar
    const churchId = id;
    const [snackOpen, setSnackOpen] = useState(false); // Snackbar state
    const router = useRouter(); // Initialize Next.js router
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);


    const fetchEvents = async () => {
        const res = await fetch(`/api/church-calendar?churchId=${churchId}`);
        const data = await res.json();
        if (data.success) {
            const formattedEvents = data.events.map(event => ({
                id: event.id.toString(),
                title: event.title,
                start: event.start,
                end: event.start,
                description: event.description || ""
            }));
            setEvents(formattedEvents);
        }
    };
    
    useEffect(() => {
        fetchEvents();
    }, [churchId]);
    
    const handleDateSelect = (selectionInfo) => {
        setNewEvent({ id: "", title: "", start: selectionInfo.startStr, end: selectionInfo.endStr || selectionInfo.startStr });
        setIsEditing(false);
        setOpen(true);
    };

    const handleEventClick = (info) => {
        console.log("🛠️ Selected Event:", info.event); // Debugging log
    
        setNewEvent({
            id: info.event.id, // Ensure this is being captured
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr || info.event.startStr,
            description: info.event.extendedProps.description || ""
        });
    
        setIsEditing(true);
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        setNewEvent({ id: "", title: "", start: "", end: "" });
        setIsEditing(false);
    };
    
    const saveEvent = async () => {
        if (!newEvent.title || !newEvent.start || !newEvent.start.includes("T")) {
            setSnackOpen(true);
            return; // Prevent execution if time is invalid
        }
    
        let adjustedStart;
    
        try {
            adjustedStart = new Date(newEvent.start);
            adjustedStart.setHours(adjustedStart.getHours());
        } catch (error) {
            console.error("❌ Invalid date format:", error);
            setSnackOpen(true);
            return;
        }
    
        const method = isEditing ? "PUT" : "POST";
    
        try {
            const res = await fetch(`/api/church-calendar?churchId=${churchId}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: isEditing ? newEvent.id : undefined,
                    title: newEvent.title, 
                    start: adjustedStart.toISOString(), 
                    church: churchId,
                    description: newEvent.description || ""
                }),
            });
    
            if (!res.ok) {
                const errorText = await res.text();
                console.error("❌ Failed to save event:", errorText);
                return;
            }
    
            const data = await res.json();
            if (data.success) {
                router.refresh();
                fetchEvents();
            }
        } catch (error) {
            console.error("❌ Unexpected error saving event:", error);
        }
    
        handleClose();
    };
    
    const deleteEvent = async () => {
        if (!newEvent.id) {
            console.error("❌ No event ID provided for deletion.");
            return;
        }
    
        const res = await fetch("/api/church-calendar", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newEvent.id }),
        });
    
        const data = await res.json();
    
        if (data.success) {
            router.refresh(); // ✅ Refresh Next.js cache
            fetchEvents(); // ✅ Manually re-fetch to update state
        } else {
            console.error("❌ Failed to delete event:", data.error);
        }
    
        handleClose();
    };
    
    
    return (
        <section className="calendar-page h-screen overflow-y-auto">
            <div className="bg-white p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800">ServeWell</h1>
            </div>
            <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 justify-center items-center p-10">
                <div className="calendar-container flex justify-center items-center mt-6 w-full max-w-4xl">
                    <div className="w-full">
                    <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-xl font-semibold text-gray-700">
                        Event Calendar
                    </h1>
                    {/* Hint Icon */}
                    <div className="relative group">
                        <div className="w-5 h-5 bg-blue-200 text-blue-700 font-bold rounded-full flex items-center justify-center text-xs cursor-pointer">
                            ?
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-800 bg-opacity-90 text-white text-xs rounded-md p-2 w-48 text-center z-20 shadow-lg">
                            This calendar shows all events. Click a date to add an event or click an event to edit it.
                        </div>
                    </div>
                </div>
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                            initialView="dayGridMonth"
                            selectable={true}
                            select={handleDateSelect}
                            eventClick={handleEventClick}
                            events={events}
                            eventContent={(eventInfo) => {
                                const startTime = new Date(eventInfo.event.startStr);
                                const formattedStartTime = startTime.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                                const description = eventInfo.event.extendedProps.description;
                                const fullTitle = eventInfo.event.title;
                                const maxTitleLength = 12;
                            
                                const truncatedTitle = fullTitle.length > maxTitleLength
                                    ? `${fullTitle.slice(0, maxTitleLength)}...`
                                    : fullTitle;
                            
                                return (
                                    <Tooltip 
                                        title={
                                            <div style={{ whiteSpace: "pre-line", padding: 4 }}>
                                                <strong>{fullTitle}</strong>
                                                <br />
                                                {description || "No description"}
                                            </div>
                                        } 
                                        placement="top" 
                                        arrow 
                                    >
                                        <div style={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "4px",
                                            maxWidth: "100%"
                                        }}>
                                            <span style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "calc(100% - 60px)" // Reserve space for the time
                                            }}>
                                                {truncatedTitle}
                                            </span>
                                            <span style={{
                                                fontSize: "0.85rem",
                                                color: "#888",
                                                whiteSpace: "nowrap",
                                                flexShrink: 0
                                            }}>
                                                ({formattedStartTime})
                                            </span>
                                        </div>
                                    </Tooltip>
                                );
                            }}
                                                                                                    
                            height="auto"
                            dayMaxEventRows={2} // ✅ LIMIT TO 2 VISIBLE
                            moreLinkClick="popover" // ✅ OPEN POPUP ON CLICK
                        />
                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {/* Event Title */}
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Event Title"
                                fullWidth
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />

                            {/* Time Scroll Wheel */}
                            <input
                                type="time"
                                value={newEvent.start ? newEvent.start.split("T")[1]?.slice(0, 5) || "" : ""}
                                onChange={(e) => {
                                    const date = newEvent.start
                                        ? newEvent.start.split("T")[0]
                                        : new Date().toISOString().split("T")[0]; // Ensure a valid date
                                    setNewEvent({ ...newEvent, start: `${date}T${e.target.value}:00` }); // Format to ISO
                                }}
                                step="900" // 15-minute intervals
                                style={{
                                    width: "120px",
                                    height: "40px",
                                    fontSize: "16px",
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "5px"
                                }}
                            />
                        </div>

                        {/* Event Description */}
                        <TextField
                            margin="dense"
                            label="Event Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={newEvent.description || ""}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                    </DialogContent>
                <DialogActions>
                    {isEditing && (
                        <Button onClick={deleteEvent} color="secondary">
                            Delete
                        </Button>
                    )}
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveEvent} color="primary">
                        {isEditing ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar Notification */}
            <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
                <Alert onClose={() => setSnackOpen(false)} severity="error">
                    Please select a time before submitting!
                </Alert>
            </Snackbar>
        </section>
    );
}