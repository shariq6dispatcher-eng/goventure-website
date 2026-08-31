"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, Printer } from "lucide-react";
import type { Order, Customer } from "@/types/rsm";

export default function OrderInvoicePage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Shrink-to-fit-one-page logic ---
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // A4 print area in px at 96dpi, after an 8mm page margin on each side
  // (matches the @page margin below). Fixed pixel numbers — not dependent
  // on print vs. screen media — so the scale is baked in well before the
  // browser starts printing, instead of racing a "beforeprint" recompute.
  const PAGE_W_PX = 733; // 194mm
  const PAGE_H_PX = 1062; // 281mm

  const recomputeScale = () => {
    if (!contentRef.current) return;
    const needed = contentRef.current.scrollHeight;
    setScale(needed > PAGE_H_PX ? PAGE_H_PX / needed : 1);
  };

  useLayoutEffect(() => {
    recomputeScale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, customer]);

  useEffect(() => {
    fetch(`/api/rsm/orders/${id}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (data.error) throw new Error(data.error);
        setOrder(data.order);

        if (data.order?.customerId) {
          const cRes = await fetch(`/api/rsm/customers/${data.order.customerId}`);
          const cData = await cRes.json();
          if (!cData.error) setCustomer(cData.customer);
        }
      })
      .catch((err) => setError(err.message || "Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d?: string) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 print:bg-white py-6 sm:py-10 print:py-0">
      <style>{`
        @page { size: A4; margin: 8mm; }
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

      {!loading && !error && order && (
        <>
          {/* Screen-only controls */}
          <div className="max-w-[850px] mx-auto flex items-center justify-between mb-4 px-4 sm:px-0 print:hidden">
            <Link
              href={`/RSM/orders/${order._id}`}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={15} /> Back to Order
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#D4AF37] text-black text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
          </div>

          {/* Fixed A4-size print frame — content is scaled down to fit inside it.
              This box is always this exact size (screen and print alike), so what
              you see on screen is exactly what prints — no last-second resizing. */}
          <div
            ref={wrapRef}
            style={{ width: PAGE_W_PX, height: PAGE_H_PX }}
            className="mx-auto overflow-hidden rounded-2xl print:rounded-none shadow-2xl print:shadow-none"
          >
            <div
              ref={contentRef}
              style={{
                width: PAGE_W_PX,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              className="bg-[#EDEDED] text-zinc-900"
            >
              {/* Black header banner */}
              <div className="bg-black text-white px-8 sm:px-10 pt-8 pb-24 relative">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white shrink-0 relative">
                      <Image
                        src="/images/logo.png"
                        alt="Goventures"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Goventures
                      </h1>
                      <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                        Info@gvcustom.com
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                      Goventures
                      <br />
                      Embroidery &amp;
                      <br />
                      Manufacturing
                    </h2>
                  </div>
                </div>
              </div>

              {/* Overlapping light panel */}
              <div className="bg-[#EDEDED] px-8 sm:px-10 -mt-16 relative pb-8">
                <div className="pt-6">
                  <h1 className="text-5xl sm:text-6xl font-black text-[#D6197F] tracking-tight mb-6">
                    INVOICE
                  </h1>

                  <div className="flex flex-wrap justify-between gap-6">
                    <div>
                      <p className="text-sm sm:text-base font-bold">
                        ORDER NO:{" "}
                        <span className="font-mono">{order.orderNo}</span>
                      </p>
                      <p className="text-sm sm:text-base font-bold mt-2">
                        DATE: {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold mb-1">Bank Details</p>
                      <p className="text-zinc-600">
                        PayPal: globaloutsourceventures@gmail.com
                      </p>
                      <p className="text-zinc-600">
                        Zelle: globaloutsourceventures@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="px-8 sm:px-10 pb-2">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-semibold mb-1.5">
                  Bill To
                </p>
                <p className="font-bold text-sm">
                  {customer?.name || order.customerName}
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

              {/* Line items table */}
              <div className="px-8 sm:px-10 pt-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#F5539E] text-white">
                      <th className="text-left py-3 px-3 font-bold uppercase text-xs sm:text-sm rounded-tl-lg">
                        Item Description
                      </th>
                      <th className="text-right py-3 px-3 font-bold uppercase text-xs sm:text-sm">
                        Qty
                      </th>
                      <th className="text-right py-3 px-3 font-bold uppercase text-xs sm:text-sm">
                        Price
                      </th>
                      <th className="text-right py-3 px-3 font-bold uppercase text-xs sm:text-sm rounded-tr-lg">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#F5F5F5]">
                    {order.items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-2.5 px-3">
                          <p className="font-bold">{it.name}</p>
                          {it.format && (
                            <p className="text-xs text-zinc-500">{it.format}</p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {it.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          ${it.price.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium">
                          ${(it.quantity * it.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="px-8 sm:px-10 pt-4 flex justify-end">
                <div className="w-full sm:w-72 space-y-1.5 text-sm">
                  <div className="flex justify-between font-bold">
                    <span>SUB TOTAL</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between font-bold">
                      <span>DISCOUNT</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>TAX</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black pt-1 border-t border-zinc-400 mt-1">
                    <span>GRAND TOTAL</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-emerald-700 font-semibold">
                    <span>Amount Paid</span>
                    <span>${order.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black">
                    <span>Balance Due</span>
                    <span className={order.balanceDue > 0 ? "text-amber-700" : "text-zinc-500"}>
                      ${order.balanceDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="px-8 sm:px-10 pt-8">
                  <p className="text-sm font-bold tracking-wide mb-2">NOTES:</p>
                  <p className="text-sm font-medium text-zinc-800 whitespace-pre-wrap">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Terms + signature */}
              <div className="px-8 sm:px-10 pt-10 pb-10 flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <p className="text-sm font-bold mb-1">Term and Conditions:</p>
                  <p className="text-sm italic text-zinc-600 max-w-xs">
                    Payment is due by the date listed above. Late payments may
                    delay production.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif italic text-2xl">Naqqash</p>
                  <p className="text-sm font-bold mt-1">Naqqash Ali</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
