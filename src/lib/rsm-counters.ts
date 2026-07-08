import { mongo } from "@/lib/mongodb";

/**
 * Simple sequential number generator for human-facing IDs (ORD-1001,
 * PMT-5001, EXP-2001). Stores the last-used number per prefix in a
 * dedicated `rsm_counters` collection so numbers never collide even
 * with concurrent writes from multiple staff.
 */
async function getNextSequence(
  counterName: string,
  startAt: number
): Promise<number> {
  const existing = await mongo.findOne<{ _id: string; value: number }>(
    "rsm_counters",
    { _id: counterName }
  );

  const next = existing ? existing.value + 1 : startAt;

  if (existing) {
    await mongo.updateOne(
      "rsm_counters",
      { _id: counterName },
      { value: next }
    );
  } else {
    await mongo.insertOne("rsm_counters", { _id: counterName, value: next });
  }

  return next;
}

export async function getNextOrderNo(): Promise<string> {
  const n = await getNextSequence("orderNo", 1001);
  return `ORD-${n}`;
}

export async function getNextPaymentNo(): Promise<string> {
  const n = await getNextSequence("paymentNo", 5001);
  return `PMT-${n}`;
}

export async function getNextExpenseNo(): Promise<string> {
  const n = await getNextSequence("expenseNo", 2001);
  return `EXP-${n}`;
}

export async function getNextRequestNo(): Promise<string> {
  const n = await getNextSequence("requestNo", 1001);
  return `REQ-${n}`;
}
