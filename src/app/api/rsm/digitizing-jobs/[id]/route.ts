import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { notifyRsm } from "@/lib/rsm-notify";
import { shouldHideFinancials, getRsmScope, canAccessJob } from "@/lib/rsm-perms";
import type { DigitizingJob, DigitizingJobInput, Customer } from "@/types/rsm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const hideFinancials = await shouldHideFinancials();
  const scope = await getRsmScope();
  const { id } = await params;

  try {
    const job = await mongo.findOne<DigitizingJob>(
      RSM_COLLECTIONS.digitizingJobs,
      { _id: toObjectId(id) }
    );

    // Same 404 whether the job doesn't exist or isn't theirs, so a
    // restricted digitizer can't probe which job IDs exist.
    if (!job || !canAccessJob(scope, job)) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (hideFinancials) {
      const redacted = {
        ...job,
        price: 0,
        customerId: "",
        customerName: "Hidden",
      };
      return NextResponse.json({ job: redacted, financialsHidden: true });
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
  const hideFinancials = await shouldHideFinancials();
  const scope = await getRsmScope();
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
    if (!existing || !canAccessJob(scope, existing)) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    let customerName = existing.customerName;
    if (!hideFinancials && body.customerId && body.customerId !== existing.customerId) {
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

    // Only non-restricted users may change who the job is assigned to.
    // A restricted digitizer can never reassign (or unassign) a job.
    // "" (not undefined) means unassigned: the DB helper drops undefined
    // values, so an empty string is the only way to actually clear it.
    const assignedTo = scope.onlyAssignedJobs
      ? existing.assignedTo ?? ""
      : body.assignedTo !== undefined
        ? body.assignedTo.trim()
        : existing.assignedTo ?? "";

    const update = {
      customerId: hideFinancials ? existing.customerId : body.customerId ?? existing.customerId,
      customerName,
      designName: body.designName.trim(),
      imageUrl: body.imageUrl ?? existing.imageUrl ?? "",
      status: body.status ?? existing.status,
      orderId: body.orderId ?? existing.orderId,
      folders: body.folders ?? existing.folders ?? [],
      price: hideFinancials ? existing.price : body.price ?? existing.price,
      format: body.format,
      notes: body.notes ?? existing.notes ?? "",
      assignedTo,
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

    if (body.status && body.status !== existing.status) {
      await notifyRsm({
        title: `Digitizing Job: ${update.status}`,
        message: `${update.designName} for ${update.customerName} is now "${update.status}".`,
        jobId: id,
        orderId: update.orderId,
      });
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
  const scope = await getRsmScope();
  const { id } = await params;

  // Deleting a job is an owner-level action. A restricted digitizer can
  // view and work on their jobs but never delete them.
  if (scope.onlyAssignedJobs) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

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
