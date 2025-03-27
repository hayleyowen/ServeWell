'use client';

import { useState, useEffect, useRef } from "react";

// this button in invoked when a user wants to request an assignment to a church
// it fetches the list of churches from the database and allows the user to select one

// when the user clicks that church on the dropdown, the user's request and the church id are sent to the
// requestingAdmins table in the database

interface Church {
  church_id: number;
}

export default function AssignmentRequestButton() {
    
}