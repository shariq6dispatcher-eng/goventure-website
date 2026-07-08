import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import type { Order } from "@/types/rsm";

/**
 * PUBLIC endpoint — intentionally does NOT call getRsmAuth(). This is a
 * customer-facing "track my order" link, same idea as a shipping tracking
 * number: knowing the order number is what grants access, no login.
 *
 * Only a safe subset of fields is returned — no customer email/phone,
 * no internal notes, no other customers' data. Just enough for the
 * customer to see progress on their own order.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  const { orderNo } = await params;

  try {
    const order = await mongo.findOne<Order>(RSM_COLLECTIONS.orders, {
      orderNo: orderNo.toUpperCase(),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Deliberately narrow shape — do not spread the full order object,
    // so new internal fields added later don't accidentally leak here.
    return NextResponse.json({
      order: {
        orderNo: order.orderNo,
        status: order.status,
        orderDate: order.orderDate,
        dueDate: order.dueDate,
        designName: order.designName || null,
        items: order.items.map((i) => ({
          name: i.name,
          category: i.category,
          quantity: i.quantity,
        })),
        total: order.total,
        balanceDue: order.balanceDue,
        customerFirstName: order.customerName.split(" ")[0],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load order" },
      { status: 500 }
    );
  }
}
