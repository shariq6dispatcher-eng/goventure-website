"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Printer } from "lucide-react";
import type { Order, Customer } from "@/types/rsm";

export default function CombinedInvoicePrintPage() {
  const searchParams = useSearchParams();
  const ids = (searchParams.get("ids") || "").split(",").filter(Boolean);
  const customerId = searchParams.get("customerId") || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ids.length === 0) {
      setError("No orders selected");
      setLoading(false);
      return;
    }

    Promise.all([
      Promise.all(
        ids.map((id) =>
          fetch(`/api/rsm/orders/${id}`)
            .then((r) => r.json())
            .then((data) => (data.error ? null : (data.order as Order)))
        )
      ),
      customerId
        ? fetch(`/api/rsm/customers/${customerId}`)
            .then((r) => r.json())
            .then((data) => (data.error ? null : (data.customer as Customer)))
        : Promise.resolve(null),
    ])
      .then(([fetchedOrders, fetchedCustomer]) => {
        const valid = fetchedOrders.filter(Boolean) as Order[];
        if (valid.length === 0) throw new Error("Could not load selected orders");
        setOrders(valid);
        setCustomer(fetchedCustomer);
      })
      .catch((err) => setError(err.message || "Failed to load invoice"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const grandSubtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const grandDiscount = orders.reduce((sum, o) => sum + o.discount, 0);
  const grandTax = orders.reduce((sum, o) => sum + o.tax, 0);
  const grandTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const grandPaid = orders.reduce((sum, o) => sum + o.amountPaid, 0);
  const grandBalance = orders.reduce((sum, o) => sum + o.balanceDue, 0);

  const invoiceNo = orders.length
    ? `COMBINED-${orders.map((o) => o.orderNo).join("-")}`
    : "";

  return (
    <div className="min-h-screen bg-zinc-950 print:bg-white py-6 sm:py-10 print:py-0">
      <style>{`
        @page { size: A4; margin: 14mm; }
        @media print {
          html, body { background: #fff !important; }
        }
      `}</style>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500 print:hidden">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading invoice…
        </div>
      )}

      {!loading && error && (
        <div className="max-w-3xl mx-auto bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4 print:hidden">
          {error}
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          {/* Screen-only controls */}
          <div className="max-w-[800px] mx-auto flex items-center justify-between mb-4 px-4 sm:px-0 print:hidden">
            <Link
              href="/RSM/orders/combined-invoice"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={15} /> Back to Selection
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#D4AF37] text-black text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
          </div>

          {/* Invoice sheet */}
          <div className="max-w-[800px] mx-auto bg-white text-zinc-900 rounded-xl print:rounded-none shadow-2xl print:shadow-none p-6 sm:p-10 print:p-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-6 border-b-2 border-zinc-900">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  GO<span className="text-[#B8860B]">VENTURE</span>
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Embroidery Digitizing &amp; Manufacturing
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  embroidery@goventuresdispatch.com
                </p>
              </div>
              <div className="text-right shrink-0">
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-zinc-800">
                  Combined Invoice
                </h2>
                <p className="text-sm font-mono font-bold text-[#B8860B] mt-1">
                  {invoiceNo}
                </p>
              </div>
            </div>

            {/* Bill To + summary */}
            <div className="grid sm:grid-cols-2 gap-6 py-6 border-b border-zinc-200">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-semibold mb-1.5">
                  Bill To
                </p>
                <p className="font-bold text-sm">
                  {customer?.name || orders[0].customerName}
                </p>
                {customer?.company && (
                  <p className="text-sm text-zinc-600">{customer.company}</p>
                )}
                {customer?.email && (
                  <p className="text-sm text-zinc-600">{customer.email}</p>
                )}
                {customer?.phone && (
                  <p className="text-sm text-zinc-600">{customer.phone}</p>
                )}
                {customer?.address && (
                  <p className="text-sm text-zinc-600">{customer.address}</p>
                )}
              </div>
              <div className="sm:text-right">
                <div className="grid grid-cols-2 sm:inline-grid sm:grid-cols-[auto_auto] gap-x-4 gap-y-1.5 text-sm">
                  <span className="text-zinc-500">Invoice Date</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                  <span className="text-zinc-500">Orders Included</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
              </div>
            </div>

            {/* Per-order sections */}
            {orders.map((order) => (
              <div key={order._id} className="py-5 border-b border-zinc-200">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <p className="text-sm font-bold font-mono text-[#B8860B]">
                      {order.orderNo}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {order.orderDate}
                      {order.designName ? ` · ${order.designName}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500">{order.status}</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-300 text-[11px] uppercase tracking-wide text-zinc-500">
                      <th className="text-left py-1.5 font-semibold">Item</th>
                      <th className="text-left py-1.5 font-semibold hidden sm:table-cell">
                        Category
                      </th>
                      <th className="text-right py-1.5 font-semibold">Qty</th>
                      <th className="text-right py-1.5 font-semibold">Price</th>
                      <th className="text-right py-1.5 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it) => (
                      <tr key={it.id} className="border-b border-zinc-100">
                        <td className="py-2">
                          <p className="font-medium">{it.name}</p>
                          {it.format && (
                            <p className="text-xs text-zinc-500 sm:hidden">
                              {it.format}
                            </p>
                          )}
                        </td>
                        <td className="py-2 text-zinc-600 hidden sm:table-cell">
                          {it.category}
                        </td>
                        <td className="py-2 text-right">{it.quantity}</td>
                        <td className="py-2 text-right">${it.price.toFixed(2)}</td>
                        <td className="py-2 text-right font-medium">
                          ${(it.quantity * it.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-2">
                  <p className="text-sm font-semibold">
                    Order Total:{" "}
                    <span className="text-[#B8860B]">
                      ${order.total.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ))}

            {/* Grand totals */}
            <div className="flex justify-end py-6">
              <div className="w-full sm:w-72 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>${grandSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Discount</span>
                  <span>-${grandDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tax</span>
                  <span>+${grandTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t-2 border-zinc-900 pt-2">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-500">Amount Paid</span>
                  <span className="text-emerald-700">
                    ${grandPaid.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Balance Due</span>
                  <span
                    className={
                      grandBalance > 0 ? "text-amber-700" : "text-zinc-500"
                    }
                  >
                    ${grandBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {grandBalance > 0 && (
              <div className="pt-4 border-t border-zinc-200">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-semibold mb-1.5">
                  Payment Details
                </p>
                <p className="text-sm text-zinc-600">
                  PayPal: globaloutsourceventures@gmail.com
                </p>
                <p className="text-sm text-zinc-600">
                  Zelle: globaloutsourceventures@gmail.com
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-8 mt-4 border-t border-zinc-200 text-center">
              <p className="text-xs text-zinc-500">
                Thank you for your business — GoVenture Embroidery &amp; Manufacturing
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
