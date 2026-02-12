export const prerender = false;

// Simple in-memory storage for development session
let voteCount = 0;

export async function GET() {
  return new Response(
    JSON.stringify({
      count: voteCount,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function POST() {
  voteCount += 1;
  return new Response(
    JSON.stringify({
      success: true,
      count: voteCount,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
