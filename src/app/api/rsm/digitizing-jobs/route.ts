import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { notifyRsm } from "@/lib/rsm-notify";
import { shouldHideFinancials } from "@/lib/rsm-perms";
import type { DigitizingJob, DigitizingJobInput, Customer } from "@/types/rsm";
export async function GET() {
  await getRsmAuth();
  const hideFinancials = await shouldHideFinancials();

  try {
    const jobs = await mongo.find<DigitizingJob>(
      RSM_COLLECTIONS.digitizingJobs,
      {},
      { createdAt: -1 }
    );

    if (hideFinancials) {
      const redacted = jobs.map((j) => ({
        ...j,
        price: 0,
        customerId: "",
        customerName: "Hidden",
      }));
      return NextResponse.json({ jobs: redacted, financialsHidden: true });
    }

    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load digitizing jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await getRsmAuth();
  const body = (await req.json()) as DigitizingJobInput;

  if (!body.customerId || !body.designName?.trim() || !body.format) {
    return NextResponse.json(
      { error: "Customer, design name, and format are required" },
      { status: 400 }
    );
  }

  try {
    const customer = await mongo.findOne<Customer>(RSM_COLLECTIONS.customers, {
      _id: toObjectId(body.customerId),
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Selected customer not found" },
        { status: 400 }
      );
    }

    const doc = {
      customerId: body.customerId,
      customerName: customer.name,
      designName: body.designName.trim(),
      imageUrl: body.imageUrl || "",
      uploadedBy: auth.username,
      status: body.status || "Pending",
      orderId: body.orderId || undefined,
      folders: body.folders || [],
      price: body.price || 0,
      format: body.format,
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
    };

   const result = await mongo.insertOne(RSM_COLLECTIONS.digitizingJobs, doc);

    await notifyRsm({
      title: "New Digitizing Job",
      message: `${doc.designName} for ${doc.customerName} was submitted for digitizing.`,
      jobId: result.insertedId,
      orderId: doc.orderId,
    });

    return NextResponse.json({
      success: true,
      job: { _id: result.insertedId, ...doc },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create digitizing job" },
      { status: 500 }
    );
  }
}
