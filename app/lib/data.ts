"use server";
import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { ResultSetHeader, RowDataPacket, OkPacket } from 'mysql2';

////////////////////////////////////////
/////// User-related functions ///////
////////////////////////////////////////

export async function getUserChurch(auth0ID: string) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [data] = await connection.execute<RowDataPacket[]>(
            `SELECT c.church_id, c.churchname 
             FROM church c
             INNER JOIN churchmember cm ON c.church_id = cm.church_id
             WHERE cm.member_id = (SELECT memID FROM users WHERE auth0ID = ?)`,
            [auth0ID]
        );
        connection.release();
        return data;
    } catch (error) {
        console.error("Failed to fetch user church:", error);
        throw new Error("Failed to fetch user church.");
    } finally {
        if (connection) connection.release();
    }
}

export async function getRequestingAdmins(auth0ID: string) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [data] = await connection.execute(``);
        connection.release();
        return data;
    } catch (error) {
        console.error("Failed to fetch requesting admins:", error);
        throw new Error("Failed to fetch requesting admins.");
    } finally {
        if (connection) connection.release();
    }
}    

export async function getUnAssignedAdmins() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [data] = await connection.execute(
            `SELECT * FROM admin WHERE ministry_id IS NULL`
        );
        connection.release();
        return data;
    } catch (error) {
        console.error("Failed to fetch unassigned admins:", error);
        throw new Error("Failed to fetch unassigned admins.");
    } finally {
        if (connection) connection.release();
    }
}

export async function showRequestingAdmins(auth0ID: string) {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = `
            SELECT 
                cm.fname, 
                cm.email, 
                cm.member_id, 
                u.minID, 
                cm.church_id,
                m.ministryname
            FROM churchmember cm 
            INNER JOIN users u ON cm.member_id = u.memID 
            INNER JOIN requestingAdmins ra ON u.auth0ID = ra.auth0ID 
            LEFT JOIN ministry m ON u.minID = m.ministry_id
            WHERE ra.churchID = (
                SELECT church_id 
                FROM churchmember 
                WHERE member_id = (
                    SELECT memID 
                    FROM users 
                    WHERE auth0ID = ?
                )
            );`
        const values = [auth0ID];
        const [data] = await connection.execute(query, values);
        connection.release();
        return data;
    } catch (error) {
        console.error("Failed to fetch requesting admins:", error);
        throw new Error("Failed to fetch requesting admins.");
    } finally {
        if (connection) connection.release();
    }
}

// when a user logs in for the first time, give them "BaseUser" privileges
export async function insertUser(nickname: string, Auth0_ID: string, email: string) {
    try {
        const client = await pool.getConnection();

        // create a new member record, if they are a new user
        const insertMember = `insert ignore into churchmember (fname, email) values (?, ?);`;
        const values = [nickname, email];
        const [newMember] = await client.execute<ResultSetHeader>(insertMember, values);
        const memID = newMember.insertId;

        // create a new user record, if they are a new user
        const insertUser = `insert ignore into users (auth0ID, memID) values (?, ?);`;
        const values1 = [Auth0_ID, memID];
        const [newUser] = await client.execute<ResultSetHeader>(insertUser, values1);
        client.release();

        return NextResponse.json({ success: true, affectedRows: newUser.affectedRows });
    } catch(error) {
        console.error("Error inserting admin:", error);
        return NextResponse.json({ error: "Failed to insert admin" }, { status: 500 });
    }
}

// for middleware to fetch the logged in user's role
export async function verifyAdmin(Auth0_ID: string) {
    let connection;
    try {
        connection = await pool.getConnection();

        const [data] = await connection.execute(
            `SELECT rID FROM users WHERE auth0ID = ?`,
            [Auth0_ID]
        );
        
        console.log("Data:", data);
        connection.release();
        return data;
    } catch (error) {
        console.error("Failed to fetch admin:", error);
        throw new Error("Failed to fetch admin.");
    } finally {
        if (connection) connection.release();
    }
}


////////////////////////////////////////
/////// Church-related functions ///////
////////////////////////////////////////


// Fetch all churches
export async function getChurches() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [data] = await connection.execute("SELECT * FROM church");
        connection.release();
        return data;
    } catch (err) {
        console.error("Database Error", err);
        throw new Error("Failed to fetch church data");
    } finally {
        if (connection) connection.release();
    }
}

// Create a new church
export async function createChurch(churchData: {
    churchName: string;
    denomination: string;
    email: string;
    phone: string;
    address: string;
    postalcode: string;
    city: string;
}) {
    let connection;
    console.log("Values being inserted:", [
        churchData.churchName ?? null,
        churchData.denomination ?? null,
        churchData.email ?? null,
        churchData.phone ?? null,
        churchData.address ?? null,
        churchData.postalcode ?? null,
        churchData.city ?? null,
    ]);

    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO church (churchname, denomination, email, churchphone, streetaddress, postalcode, city)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                churchData.churchName,
                churchData.denomination ?? null,
                churchData.email ?? null,
                churchData.phone ?? null,
                churchData.address ?? null,
                churchData.postalcode ?? null,
                churchData.city ?? null,
            ]
        );

        connection.release();
        return { success: true, insertedId: result.insertId };
    } catch (error) {
        console.error("Failed to create church:", error);
        throw new Error("Failed to create church.");
    } finally {
        if (connection) connection.release();
    }
}

export async function getChurchByID(churchID: number) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [data] = await connection.execute<RowDataPacket[]>(
            `SELECT * FROM church WHERE church_id = ? LIMIT 1`,
            [churchID]
        );
        connection.release();
        return data[0] || null; // Return the first result or null if not found
    } catch (error) {
        console.error("Failed to fetch church by ID:", error);
        throw new Error("Failed to fetch church.");
    } finally {
        if (connection) connection.release();
    }
}

// Function to update a church
export async function updateChurch(churchData: {
    churchName: string;
    denomination: string;
    email: string;
    phone: string;
    address: string;
    postalcode: string;
    city: string;
}) {
    let connection;
    try {
        connection = await pool.getConnection();
    
        // Check if the church exists
        const [existingChurch] = await connection.execute<RowDataPacket[]>(
            `SELECT church_id FROM church WHERE churchname = ?`,
            [churchData.churchName]
        );
    
        if (existingChurch.length > 0) {
            // Update the existing church
            await connection.execute(
                `UPDATE church 
                SET denomination = ?, email = ?, churchphone = ?, streetaddress = ?, postalcode = ?, city = ? 
                WHERE churchname = ?`,
                [
                    churchData.denomination,
                    churchData.email,
                    churchData.phone,
                    churchData.address,
                    churchData.postalcode,
                    churchData.city,
                    churchData.churchName,
                ]
            );
            return { success: true, message: 'Church updated successfully' };
        } else {
            // Church does not exist
            return { success: false, message: 'Church not found' };
        }
    } catch (error) {
        console.error('Failed to update church:', error);
        throw new Error('Failed to update church.');
    } finally {
        if (connection) connection.release();
    }
}

////////////////////////////////////////
////// Ministry-related functions //////
////////////////////////////////////////

// Function to fetch all ministries
export async function getMinistries() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [data] = await connection.execute("SELECT ministry_id, ministryname, url_path FROM ministry");
        connection.release();

        console.log("Fetched ministries:", data);
        return data;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch ministry data");
    } finally {
        if (connection) connection.release();
    }
}

// For the TopNav when a user is logged in
export async function getMinistriesByID(auth0ID: string) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [data] = await connection.execute(
            `
            SELECT ministry_id, ministryname, url_path 
            FROM ministry 
            WHERE 
                -- If rID is 1, match the user's minID
                (
                    (SELECT rID FROM users WHERE auth0ID = ?) = 1 
                    AND ministry_id = (SELECT minID FROM users WHERE auth0ID = ?)
                )
                OR 
                -- If rID is 2, match the church_id
                (
                    (SELECT rID FROM users WHERE auth0ID = ?) = 2 
                    AND church_id = (SELECT church_id FROM churchmember WHERE member_id = (SELECT memID FROM users WHERE auth0ID = ?))
                )
            `,
            [auth0ID, auth0ID, auth0ID, auth0ID]
        );
        connection.release();

        console.log("Fetched ministries:", data);
        return data;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch ministry data");
    } finally {
        if (connection) connection.release();
    }
}

// Fetch ministry by URL path
export async function getMinistryByUrlPath(urlPath: string) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [ministry] = await connection.execute<RowDataPacket[]>(
            "SELECT * FROM ministry WHERE url_path = ? LIMIT 1",
            [urlPath]
        );
        connection.release();
        return ministry[0] || null;
    } catch (error) {
        console.error("Failed to fetch ministry:", error);
        throw new Error("Failed to fetch ministry.");
    } finally {
        if (connection) connection.release();
    }
}

// Fetch ministry by name (case-insensitive search)
export async function getMinistryByName(name: string) {
    let connection;
    try {
        console.log("Fetching ministry with name:", name);
        connection = await pool.getConnection();
        const [ministry] = await connection.execute<RowDataPacket[]>(
            "SELECT * FROM ministry WHERE LOWER(url_path) LIKE LOWER(?) LIMIT 1",
            [`%${name}%`]
        );
        connection.release();

        console.log("Found ministry:", ministry[0]);
        if (!ministry[0]) {
            console.log("No ministry found with name:", name);
        }

        return ministry[0] || null;
    } catch (error) {
        console.error("Error in getMinistryByName:", error);
        throw new Error("Failed to fetch ministry.");
    } finally {
        if (connection) connection.release();
    }
}

// Fetch ministry by ID
export async function getMinistryByID(id: number) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [ministry] = await connection.execute<RowDataPacket[]>(
            "SELECT * FROM ministry WHERE ministry_id = ? LIMIT 1",
            [id]
        );
        connection.release();
        return ministry[0] || null;
    } catch (error) {
        console.error("Failed to fetch ministry:", error);
        throw new Error("Failed to fetch ministry.");
    } finally {
        if (connection) connection.release();
    }
}

// Function to create a ministry
export async function createMinistry(ministryData: {
    MinistryName: string;
    Description: string;
    Church_ID: number;
}) {
    let connection;
    try {
        connection = await pool.getConnection();

        const urlFriendlyName = ministryData.MinistryName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO ministry (ministryname, church_id, description, url_path) 
             VALUES (?, ?, ?, ?)`,
            [
                ministryData.MinistryName,
                ministryData.Church_ID,
                ministryData.Description,
                urlFriendlyName
            ]
        );

        connection.release();
        return { success: true, insertedId: result.insertId };
    } catch (error) {
        console.error("Failed to create ministry:", error);
        throw new Error("Failed to create ministry.");
    } finally {
        if (connection) connection.release();
    }
}

// Function to update a ministry
export async function updateMinistry(ministryData: {
    ministryName: string;
    description: string;
}) {
    let connection;
    try {
        connection = await pool.getConnection();
    
        // Check if the ministry exists
        const [existingMinistry] = await connection.execute<RowDataPacket[]>(
            `SELECT ministry_id FROM ministry WHERE ministryname = ?`,
            [ministryData.ministryName]
        );
    
        if (existingMinistry.length > 0) {
            // Update the existing ministry
            await connection.execute(
                `UPDATE ministry SET description = ? WHERE ministryname = ?`,
                [ministryData.description, ministryData.ministryName]
            );
            return { success: true, message: 'Ministry updated successfully' };
        } else {
            // Ministry does not exist
            return { success: false, message: 'Ministry not found' };
        }
    } catch (error) {
        console.error('Failed to update ministry:', error);
        throw new Error('Failed to update ministry.');
    } finally {
        if (connection) connection.release();
    }
}

// Function to delete a ministry by url_path variable
export async function deleteMinistryByURLPath(name: string) {
    let connection;
    try {
        connection = await pool.getConnection();

        // Start a transaction
        await connection.beginTransaction();

        // Set Ministry_ID to NULL in the Admin table for related records
        await connection.execute(
            `UPDATE users set minID = NULL where minID = (SELECT ministry_id FROM ministry WHERE url_path = ?)`,
            [name]
        );

        // Delete the ministry
        const [result] = await connection.execute<ResultSetHeader>(
            `DELETE FROM ministry WHERE url_path = ?`,
            [name]
        );

        // Commit the transaction
        await connection.commit();

        connection.release();
        return result.affectedRows > 0; // Returns true if a row was deleted
    } catch (error) {
        if (connection) await connection.rollback(); // Rollback in case of error
        console.error("Failed to delete ministry:", error);
        throw new Error("Failed to delete ministry.");
    } finally {
        if (connection) connection.release();
    }
}

// Delete ministry by ID
export async function deleteMinistryByID(id: number) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute<ResultSetHeader>(
            "DELETE FROM ministry WHERE ministry_id = ?",
            [id]
        );
        connection.release();
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Failed to delete ministry:", error);
        throw new Error("Failed to delete ministry.");
    } finally {
        if (connection) connection.release();
    }
}

////////////////////////////////////////
///// SuperAdmin-related functions /////
////////////////////////////////////////

// Function to create a super admin
export async function createSuperAdmin(data: {
    firstName: string;
    email: string;
    church_id: number;
    auth0ID: string;
}) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction(); // Start a transaction

        const [churchIdResult] = await connection.execute(
            "SELECT church_id FROM church ORDER BY church_id DESC LIMIT 1;"
        );

        const churchId = churchIdResult[0]?.church_id; // Increment the church ID for the new church

        // Insert into churchmember table
        const [memberResult] = await connection.execute(
            `
            INSERT INTO churchmember (fname, mname, lname, email, memberphone, church_id, activity_status)
            VALUES (?, null, null, ?, null, ?, 'Active')
            ON DUPLICATE KEY UPDATE 
                church_id = VALUES(church_id);
            `,
                [
                    data.firstName,
                    data.email,
                    churchId
                ]
            
        );

        const member_id = memberResult.insertId;

        const [adminResult] = await connection.execute(
            `
            INSERT INTO users (auth0ID, memID, rID, minID)
            VALUES (?, ?, 2, NULL)
            ON DUPLICATE KEY UPDATE 
                rID = VALUES(rID),
                minID = VALUES(minID);
            `,
            [data.auth0ID, member_id]
        );

        await connection.commit(); // Commit the transaction
        connection.release();

        return {
            success: true,
            member_id: member_id,
            admin_id: adminResult.insertId
        };
    } catch (error) {
        if (connection) await connection.rollback(); // Rollback in case of error
        console.error("Failed to create super admin:", error);
        throw new Error("Failed to create super admin.");
    } finally {
        if (connection) connection.release();
    }
}

////////////////////////////////////////
//////// Role-related functions ////////
////////////////////////////////////////

export async function getMedia() {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM media 
            ORDER BY date DESC
        `);
        return rows;
    } catch (error) {
        console.error('Error fetching media:', error);
        throw new Error('Failed to fetch media.');
    }
}

