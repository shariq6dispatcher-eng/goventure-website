import { mongo } from "@/lib/mongodb";

// Simple connectivity check for the MongoDB Data API.
// Hit /api/portfolio/test after deployment to verify env vars are set
// correctly on Cloudflare (see deployment guide).
export async function GET() {
  try {
    await mongo.find("portfolio", {}, undefined);
    return Response.json({ success: true, message: "MongoDB Data API reachable" });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
