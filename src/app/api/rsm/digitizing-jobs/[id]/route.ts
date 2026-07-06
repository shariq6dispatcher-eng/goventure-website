import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { DigitizingJob, DigitizingJobInput, Customer } from "@/types/rsm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const job = await mongo.findOne<DigitizingJob>(
      RSM_COLLECTIONS.digitizingJobs,
      { _id: toObjectId(id) }
    );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;
  const body = (await req.json()) as Partial<DigitizingJobInput>;

  if (!body.designName?.trim() || !body.format) {
    return NextResponse.json(
      { error: "Design name and format are required" },
      { status: 400 }
    );
  }

  try {
    const existing = await mongo.findOne<DigitizingJob>(
      RSM_COLLECTIONS.digitizingJobs,
      { _id: toObjectId(id) }
    );
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    let customerName = existing.customerName;
    if (body.customerId && body.customerId !== existing.customerId) {
      const customer = await mongo.findOne<Customer>(
        RSM_COLLECTIONS.customers,
        { _id: toObjectId(body.customerId) }
      );
      if (!customer) {
        return NextResponse.json(
          { error: "Selected customer not found" },
          { status: 400 }
        );
      }
      customerName = customer.name;
    }

    const update = {
      customerId: body.customerId ?? existing.customerId,
      customerName,
      designName: body.designName.trim(),
      imageUrl: body.imageUrl ?? existing.imageUrl ?? "",
      status: body.status ?? existing.status,
      orderId: body.orderId ?? existing.orderId,
      folders: body.folders ?? existing.folders ?? [],
      price: body.price ?? existing.price,
      format: body.format,
      notes: body.notes ?? existing.notes ?? "",
      updatedAt: new Date().toISOString(),
    };

    const result = await mongo.updateOne(
      RSM_COLLECTIONS.digitizingJobs,
      { _id: toObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const result = await mongo.deleteOne(RSM_COLLECTIONS.digitizingJobs, {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
