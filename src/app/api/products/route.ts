import { mongo } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await mongo.find("products", {}, { createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products GET Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await mongo.insertOne("products", {
      title: body.title,
      description: body.description,
      category: body.category,
      price: body.price,
      image: body.image,
      featured: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Products POST Error:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
