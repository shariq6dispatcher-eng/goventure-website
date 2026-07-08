import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { getNextExpenseNo } from "@/lib/rsm-counters";
import type { Expense, ExpenseInput } from "@/types/rsm";

export async function GET() {
  await getRsmAuth();

  try {
    const expenses = await mongo.find<Expense>(
      RSM_COLLECTIONS.expenses,
      {},
      { createdAt: -1 }
    );
    return NextResponse.json({ expenses });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await getRsmAuth();
  const body = (await req.json()) as ExpenseInput;

  if (!body.category || !body.description?.trim() || !body.amount || body.amount <= 0 || !body.date) {
    return NextResponse.json(
      { error: "Category, description, a positive amount, and date are required" },
      { status: 400 }
    );
  }

  try {
    const expenseNo = await getNextExpenseNo();

    const doc = {
      expenseNo,
      category: body.category,
      description: body.description,
      amount: body.amount,
      date: body.date,
      refNo: body.refNo || "",
      screenshot: body.screenshot || "",
      loggedBy: auth.username,
      createdAt: new Date().toISOString(),
    };

    const result = await mongo.insertOne(RSM_COLLECTIONS.expenses, doc);
    return NextResponse.json({
      success: true,
      expense: { _id: result.insertedId, ...doc },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
