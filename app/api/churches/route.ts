import pool from '../../lib/database';
import { NextRequest, NextResponse } from 'next/server';


export default async function handler(req, res) {
    try {
        const [churches] = await pool.query('SELECT * FROM church');
        res.status(200).json(churches);
    } catch (err) {
        console.error('Database query Error', err);
        res.status(500).json({ error: 'Failed to fetch church data' });
    }
}