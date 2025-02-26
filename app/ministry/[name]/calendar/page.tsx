"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import "@/app/globals.css";

export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ id: "", title: "", start: "" });
    const [isEditing, setIsEditing] = useState(false);

    const handleDateClick = (arg) => {
        setNewEvent({ id: "", title: "", start: arg.dateStr });
        setIsEditing(false);
        setOpen(true);
    };

    const handleEventClick = (info) => {
        setNewEvent({ id: info.event.id, title: info.event.title, start: info.event.startStr });
        setIsEditing(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewEvent({ id: "", title: "", start: "" });
        setIsEditing(false);
    };

    const handleAddOrUpdateEvent = () => {
        if (newEvent.title && newEvent.start) {
            if (isEditing) {
                setEvents(events.map(event => 
                    event.id === newEvent.id ? { ...event, title: newEvent.title } : event
                ));
            } else {
                const newId = Date.now().toString();
                setEvents([...events, { id: newId, title: newEvent.title, start: newEvent.start }]);
            }
        }
        handleClose();
    };

    const handleDeleteEvent = () => {
        setEvents(events.filter(event => event.id !== newEvent.id));
        handleClose();
    };

    const renderEventContent = (eventInfo) => {
        return (
            <div className="event-content">
                <span>{eventInfo.event.title}</span>
                <button onClick={(e) => {
                    e.stopPropagation();
                    setEvents(events.filter(event => event.id !== eventInfo.event.id));
                }} className="delete-btn">×</button>
            </div>
        );
    };

    return (
        <section className="calendar-page">
            <div className="bg-white p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800">ServeWell</h1>
            </div>
    
            <div className="flex-1 flex flex-col bg-blue-500 justify-center items-center"> 
                <div className="calendar-container flex justify-center items-center"> 
                    <div className="w-full max-w-4xl"> {/* Set max width to control calendar size */}
                        <h1 className="text-xl font-semibold text-gray-700 mb-4">Event Calendar</h1>
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                            initialView="dayGridMonth"
                            selectable={true}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            events={events}
                            height="auto"
                            eventContent={renderEventContent}
                        />
                    </div>
                </div>
            </div>
    
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Event Title"
                        fullWidth
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {isEditing && <Button onClick={handleDeleteEvent} color="secondary">Delete</Button>}
                    <Button onClick={handleAddOrUpdateEvent} color="primary">
                        {isEditing ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
}    