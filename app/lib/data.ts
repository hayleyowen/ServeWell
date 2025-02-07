"use server";
import { neon } from '@neondatabase/serverless';
import { Church, Ministry } from './defintions';

const sql = neon(process.env.DATABASE_URL!);


const sql = neon(process.env.DATABASE_URL!);

// Church-related functions
export async function getChurches() {
    try {
        const data = await sql<Church>`SELECT * FROM church`;
        return data;
    } catch (err) {
        console.error('Database Error', err);
        throw new Error('Failed to fetch church data');
    }
}

export async function createChurch(churchData: {
    churchName: string;
    denomination: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    city: string;
}): Promise<Church> {
    const result = await sql`
        INSERT INTO church (
            churchname,
            denomination,
            email,
            churchphone,
            streetaddress,
            postalcode,
            city
        ) VALUES (
            ${churchData.churchName},
            ${churchData.denomination},
            ${churchData.email},
            ${churchData.phone},
            ${churchData.address},
            ${churchData.postalCode},
            ${churchData.city}
        )
        RETURNING *;
    `;

    return result[0] as Church;
}

// Ministry-related functions
export async function getMinistries() {
    try {
        const data = await sql<Ministry>`SELECT * FROM ministry`;
        console.log('Fetched ministries:', data);
        return data;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch ministry data');
    }
}

export async function getMinistryByUrlPath(urlPath: string) {
    try {
        const ministry = await sql`
            SELECT * FROM ministry 
            WHERE url_path = ${urlPath}
            LIMIT 1
        `;
        return ministry[0];
    } catch (error) {
        console.error('Failed to fetch ministry:', error);
        throw new Error('Failed to fetch ministry.');
    }
}

export async function getMinistryByName(name: string) {
    try {
        console.log('Fetching ministry with name:', name);
        const ministry = await sql`
            SELECT * FROM ministry 
            WHERE LOWER(ministryname) LIKE ${`%${name}%`}
            LIMIT 1
        `;
        
        console.log('Found ministry:', ministry[0]);
        if (!ministry[0]) {
            console.log('No ministry found with name:', name);
        }
        
        return ministry[0];
    } catch (error) {
        console.error('Error in getMinistryByName:', error);
        throw new Error('Failed to fetch ministry.');
    }
}

export async function createMinistry(ministryData: {
    MinistryName: string;
    Description: string;
    Church_ID: number;
    Budget: number;
}) {
    try {
        const urlFriendlyName = ministryData.MinistryName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

        const result = await sql`
            INSERT INTO ministry (
                ministryname, 
                church_id, 
                description,
                url_path,
                budget
            ) VALUES (
                ${ministryData.MinistryName},
                ${ministryData.Church_ID},
                ${ministryData.Description},
                ${urlFriendlyName},
                ${ministryData.Budget}
            )
            RETURNING *
        `;
        return result[0];
    } catch (error) {
        console.error('Failed to create ministry:', error);
        throw new Error('Failed to create ministry.');
    }
}

// Admin-related functions
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
    // First create the church member
    const memberResult = await sql`
        INSERT INTO churchmember (
            fname,
            mname,
            lname,
            email,
            memberphone,
            church_id,
            church_join_date,
            activity_status
        ) VALUES (
            ${data.firstName},
            ${data.middleName || null},
            ${data.lastName},
            ${data.email},
            ${data.phoneNumber},
            ${data.church_id},
            CURRENT_DATE,
            'Active'
        ) 
        RETURNING member_id;
    `;

    const member_id = memberResult[0].member_id;

    // Then create the superadmin
    const superAdminResult = await sql`
        INSERT INTO superadmin (
            member_id,
            superusername,
            superpassword,
            church_id
        ) VALUES (
            ${member_id},
            ${data.username},
            ${data.password},
            ${data.church_id}
        )
        RETURNING superadmin_id;
    `;

    return {
        success: true,
        member_id: member_id,
        superadmin_id: superAdminResult[0].superadmin_id
    };
}