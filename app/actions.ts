import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:bMuNiEA2S3UB@ep-young-dream-a45q72ry.us-east-1.aws.neon.tech/neondb?sslmode=require');

const posts = await sql('SELECT * FROM church');

// See https://neon.tech/docs/serverless/serverless-driver
// for more information