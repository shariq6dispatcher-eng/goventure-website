import { MongoClient } from "mongodb";

export async function GET() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI!);

    await client.connect();

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}