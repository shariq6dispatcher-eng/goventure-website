import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// CREATE QUOTE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("goventure");

    await db.collection("quotes").insertOne({
  name: body.name,
  email: body.email,
  phone: body.phone,
  company: body.company,
  service: body.service,
  description: body.description,
  quantity: body.quantity,
  country: body.country,
  deliveryDate: body.deliveryDate,

  artwork: body.artwork,

  status: "New",
  createdAt: new Date(),
});

    return NextResponse.json({
      success: true,
      message: "Quote submitted successfully",
    });
  } catch (error) {
    console.error("Quote POST Error:", error);

    return NextResponse.json(
      {
        error: "Failed to submit quote",
      },
      {
        status: 500,
      }
    );
  }
}

// GET ALL QUOTES
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("goventure");

    const quotes = await db
      .collection("quotes")
      .find({})
      .sort({
        createdAt: -1,
      })
      .toArray();

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Quote GET Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch quotes",
      },
      {
        status: 500,
      }
    );
  }
}