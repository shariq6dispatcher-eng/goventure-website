import { mongo } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// CREATE QUOTE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await mongo.insertOne("quotes", {
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
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Quote submitted successfully",
    });
  } catch (error) {
    console.error("Quote POST Error:", error);

    return NextResponse.json(
      { error: "Failed to submit quote" },
      { status: 500 }
    );
  }
}

// GET ALL QUOTES
export async function GET() {
  try {
    const quotes = await mongo.find("quotes", {}, { createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Quote GET Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
