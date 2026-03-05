import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const result = await sql`
      SELECT url
      FROM gifs
      ORDER BY random()
      LIMIT 1
    `;

    return new Response(
      JSON.stringify({
        gif: result[0].url
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Database error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
