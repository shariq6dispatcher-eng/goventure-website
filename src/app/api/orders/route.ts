// import clientPromise from "@/lib/mongodb";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const client = await clientPromise;
//     const db = client.db("goventure");

//     await db.collection("orders").insertOne({
//       customerName: body.customerName,
//       email: body.email,
//       phone: body.phone,
//       product: body.product,
//       quantity: body.quantity,
//       notes: body.notes,
//       createdAt: new Date(),
//       status: "Pending",
//     });

//     return NextResponse.json({
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { success: false },
//       { status: 500 }
//     );
//   }
// }
