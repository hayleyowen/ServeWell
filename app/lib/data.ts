"use server";
import pool from "@/app/lib/database";

////////////////////////////////////////
/////// Admin-related functions ///////
////////////////////////////////////////

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
        const [result] = await connection.execute(
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

// Fetch ministry by URL path
export async function getMinistryByUrlPath(urlPath: string) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [ministry] = await connection.execute(
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
        const [ministry] = await connection.execute(
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


// Function to create a ministry
export async function createMinistry(ministryData: {
    MinistryName: string;
    Description: string;
    Church_ID: number;
    Budget: number;
}) {
    let connection;
    try {
        connection = await pool.getConnection();

        const urlFriendlyName = ministryData.MinistryName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

        const [result] = await connection.execute(
            `INSERT INTO ministry (ministryname, church_id, description, url_path, budget) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                ministryData.MinistryName,
                ministryData.Church_ID,
                ministryData.Description,
                urlFriendlyName,
                ministryData.Budget
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

////////////////////////////////////////
///// SuperAdmin-related functions /////
////////////////////////////////////////

// Function to create a super admin
export async function createSuperAdmin(data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    church_id: number;
}) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction(); // Start a transaction

        const [churchId] = await connection.execute(
            "SELECT church_id FROM church ORDER BY church_id DESC LIMIT 1;"
        );

        // Insert into churchmember table
        const [memberResult] = await connection.execute(
            `INSERT INTO churchmember (fname, mname, lname, email, memberphone, church_id, church_join_date, activity_status) 
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE, 'Active')`,
            [
                data.firstName,
                data.middleName || null,
                data.lastName,
                data.email,
                data.phoneNumber,
                data.church_id
            ]
        );

        const member_id = memberResult.insertId;

        // Insert into superadmin table
        const [superAdminResult] = await connection.execute(
            `INSERT INTO superadmin (member_id, superusername, superpassword, church_id) 
             VALUES (?, ?, ?, ?)`,
            [member_id, data.username, data.password, data.church_id]
        );

        await connection.commit(); // Commit the transaction
        connection.release();

        return {
            success: true,
            member_id: member_id,
            superadmin_id: superAdminResult.insertId
        };
    } catch (error) {
        if (connection) await connection.rollback(); // Rollback in case of error
        console.error("Failed to create super admin:", error);
        throw new Error("Failed to create super admin.");
    } finally {
        if (connection) connection.release();
    }
}

// Function to fetch super admins
export async function getSuperAdmins() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [data] = await connection.execute("SELECT * FROM superadmin");
        connection.release();
        return data;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch super admin data");
    } finally {
        if (connection) connection.release();
    }
}