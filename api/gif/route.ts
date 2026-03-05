import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {

  const result = await sql`
    SELECT url
    FROM gifs
    ORDER BY random()
    LIMIT 1
  `

  return Response.json({
    gif: result[0].url
  })
}
