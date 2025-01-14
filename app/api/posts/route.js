import {createConnection} from '@/lib/db.js'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const db = await createConnection()
        const sql = "SELECT * FROM church"
        const [posts] = await db.query(sql)
        return NextResponse.json({posts: posts})
    } catch(err) {
        console.error(err)
        return NextResponse.json({err: err.message})
    }
}