import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Expense, ExpenseInput } from "@/types/rsm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const expense = await mongo.findOne<Expense>(RSM_COLLECTIONS.expenses, {
      _id: toObjectId(id),
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ expense });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load expense" },
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
  const body = (await req.json()) as Partial<ExpenseInput>;

  if (!body.category || !body.description?.trim() || !body.amount || body.amount <= 0 || !body.date) {
    return NextResponse.json(
      { error: "Category, description, a positive amount, and date are required" },
      { status: 400 }
    );
  }

  try {
    const existing = await mongo.findOne<Expense>(RSM_COLLECTIONS.expenses, {
      _id: toObjectId(id),
    });
    if (!existing) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const update = {
      category: body.category,
      description: body.description,
      amount: body.amount,
      date: body.date,
      refNo: body.refNo ?? existing.refNo ?? "",
      screenshot: body.screenshot ?? existing.screenshot ?? "",
    };

    const result = await mongo.updateOne(
      RSM_COLLECTIONS.expenses,
      { _id: toObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update expense" },
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
    const result = await mongo.deleteOne(RSM_COLLECTIONS.expenses, {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
