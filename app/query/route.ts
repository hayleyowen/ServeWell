import { db } from "@vercel/postgres";

const client = await db.connect();

async function getChurches() {
    const data = await client.sql`Select * From church`;
    return data.rows;

}

export async function GET() {
    try {
        return Response.json(await getChurches());
    } catch (err) {
        return Response.json({err}, {status: 500});
    }
}