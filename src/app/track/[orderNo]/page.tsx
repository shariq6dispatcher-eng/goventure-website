import Link from "next/link";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import type { Order } from "@/types/rsm";

// Same status list your RSM panel uses, in visual left-to-right order —
// used to render the progress steps below.
const STEPS: Order["status"][] = ["Pending", "In Progress", "Completed", "Delivered"];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

interface PageProps {
  params: Promise<{ orderNo: string }>;
}

export default async function TrackOrderPage({ params }: PageProps) {
  const { orderNo } = await params;

  const order = await mongo.findOne<Order>(RSM_COLLECTIONS.orders, {
    orderNo: orderNo.toUpperCase(),
  });

  return (
    <div className="min-h-screen bg-black text-white flex items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[3px] text-[#D4AF37]">GoVenture</p>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">Order Tracking</h1>
        </div>

        {!order ? (
          <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-8 text-center">
            <p className="text-sm text-zinc-300 font-semibold">
              We couldn&apos;t find an order matching{" "}
              <span className="font-mono text-[#D4AF37]">{orderNo}</span>
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Double-check the order number and try again, or contact us if you
              believe this is a mistake.
            </p>
            <Link
              href="/track"
              className="inline-block mt-5 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-bold"
            >
              Try Another Order Number
            </Link>
          </div>
        ) : (
          <>
            {order.status === "Cancelled" ? (
              <div className="bg-zinc-900/60 border border-red-900/40 rounded-2xl p-6 sm:p-8 mb-5">
                <p className="text-xs text-zinc-500">Order {order.orderNo}</p>
                <p className="text-lg font-bold text-rose-400 mt-1">This order was cancelled</p>
                <p className="text-xs text-zinc-500 mt-2">
                  If you have questions about this, please contact us directly.
                </p>
              </div>
            ) : (
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-6 sm:p-8 mb-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-zinc-500">Order</p>
                    <p className="font-mono font-black text-[#D4AF37]">{order.orderNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">For</p>
                    <p className="text-sm font-semibold">{order.customerName.split(" ")[0]}</p>
                  </div>
                </div>

                {/* Progress steps */}
                <div className="flex items-center mb-6">
                  {STEPS.map((step, i) => {
                    const currentIdx = STEPS.indexOf(order.status);
                    const reached = i <= currentIdx;
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-3 h-3 rounded-full shrink-0 ${
                              reached ? "bg-[#D4AF37]" : "bg-zinc-800"
                            }`}
                          />
                          <span
                            className={`text-[9px] sm:text-[10px] whitespace-nowrap ${
                              reached ? "text-white font-semibold" : "text-zinc-600"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 mx-1 ${
                              i < currentIdx ? "bg-[#D4AF37]" : "bg-zinc-800"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm border-t border-zinc-900 pt-4">
                  <div>
                    <p className="text-xs text-zinc-500">Order Date</p>
                    <p className="font-medium mt-0.5">{order.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Expected By</p>
                    <p className="font-medium mt-0.5">{order.dueDate}</p>
                  </div>
                </div>
              </div>
            )}

            {order.status !== "Cancelled" && (
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6 mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-3">
                  Items
                </h3>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">
                        {item.name}{" "}
                        <span className="text-zinc-600 text-xs">× {item.quantity}</span>
                      </span>
                      <span className="text-zinc-500 text-xs">{item.category}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-900 mt-4 pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="font-mono font-bold text-white">{money(order.total)}</span>
                </div>
                {order.balanceDue > 0 && (
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-amber-400">Balance Due</span>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {money(order.balanceDue)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <p className="text-center text-xs text-zinc-600">
              Questions about this order? Contact GoVenture Embroidery &amp; Manufacturing directly.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
