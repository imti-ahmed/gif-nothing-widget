import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const current = searchParams.get("current");

    let result;

    if (current) {
      result = await sql`
        SELECT url
        FROM gifs
        WHERE id > (
          SELECT id FROM gifs WHERE url = ${current}
        )
        ORDER BY id
        LIMIT 1
      `;

      if (result.length === 0) {
        result = await sql`
          SELECT url
          FROM gifs
          ORDER BY id
          LIMIT 1
        `;
      }
    } else {
      result = await sql`
        SELECT url
        FROM gifs
        ORDER BY id
        LIMIT 1
      `;
    }

    return new Response(JSON.stringify({ gif: result[0].url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
