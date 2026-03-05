import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const current = searchParams.get("current");

  let result;

  if (!current) {
    result = await sql`
      SELECT url
      FROM gifs
      ORDER BY position
      LIMIT 1
    `;
  } else {

    const filename = current.split("/").pop();

    result = await sql`
      SELECT url
      FROM gifs
      WHERE position >
        (
          SELECT position
          FROM gifs
          WHERE url LIKE ${'%' + filename}
        )
      ORDER BY position
      LIMIT 1
    `;

    if (result.length === 0) {
      result = await sql`
        SELECT url
        FROM gifs
        ORDER BY position
        LIMIT 1
      `;
    }
  }

  return new Response(JSON.stringify({ gif: result[0].url }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
