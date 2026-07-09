import Link from "next/link";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS, PAYMENT_DETAILS } from "@/types/constants";
import type { OnlineOrder } from "@/types/rsm";
import ApproveQuoteButton from "@/components/ApproveQuoteButton";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";
import PaymentScreenshotUpload from "@/components/PaymentScreenshotUpload";
import { AlertTriangle } from "lucide-react";

// Linear pipeline for the progress bar. "Rejected" is a side branch and
// intentionally left out — it gets its own red-tinted message instead,
// same treatment /track gives cancelled orders.
const STEPS: OnlineOrder["status"][] = [
  "Requested",
  "Quoted",
  "Approved",
  "Files Ready",
  "Payment Submitted",
  "Payment Approved",
  "Completed",
];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

interface PageProps {
  params: Promise<{ requestNo: string }>;
}

export default async function OrderStatusPage({ params }: PageProps) {
  const { requestNo } = await params;

  const order = await mongo.findOne<OnlineOrder>(RSM_COLLECTIONS.onlineOrders, {
    requestNo: requestNo.toUpperCase(),
  });

  return (
    <div className="min-h-screen bg-black text-white flex items-start justify-center px-4 py-10 sm:py-16 print:bg-white print:py-0 print:min-h-0">
      <div className="w-full max-w-lg">
        <div className="print:hidden text-center mb-8">
          <p className="text-xs uppercase tracking-[3px] text-[#D4AF37]">GoVenture</p>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">Order Status</h1>
        </div>

        {!order ? (
          <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-8 text-center">
            <p className="text-sm text-zinc-300 font-semibold">
              We couldn&apos;t find a request matching{" "}
              <span className="font-mono text-[#D4AF37]">{requestNo}</span>
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Double-check the link, or place a new order below.
            </p>
            <Link
              href="/order"
              className="inline-block mt-5 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-bold"
            >
              Place An Order
            </Link>
          </div>
        ) : (
          <>
            {order.status === "Rejected" ? (
              <div className="bg-zinc-900/60 border border-red-900/40 rounded-2xl p-6 sm:p-8 mb-5">
                <p className="text-xs text-zinc-500">Request {order.requestNo}</p>
                <p className="text-lg font-bold text-rose-400 mt-1">
                  This request couldn&apos;t be accepted
                </p>
                {order.rejectedReason && (
                  <p className="text-xs text-zinc-500 mt-2">{order.rejectedReason}</p>
                )}
                <p className="text-xs text-zinc-500 mt-2">
                  Contact us directly if you have questions.
                </p>
              </div>
            ) : (
              <div className="print:hidden bg-zinc-900/60 border border-zinc-900 rounded-2xl p-6 sm:p-8 mb-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-zinc-500">Request</p>
                    <p className="font-mono font-black text-[#D4AF37]">{order.requestNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">For</p>
                    <p className="text-sm font-semibold">
                      {order.customerName.split(" ")[0]}
                    </p>
                  </div>
                </div>

                {order.urgent && (
                  <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 border border-amber-900/40 rounded-lg px-3 py-2 mb-5">
                    <AlertTriangle size={13} /> Marked urgent — needed as soon as possible
                  </div>
                )}

                {/* Progress steps */}
                <div className="flex items-center mb-2 overflow-x-auto pb-1">
                  {STEPS.map((step, i) => {
                    const currentIdx = STEPS.indexOf(order.status);
                    const reached = i <= currentIdx;
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none min-w-[54px]">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-3 h-3 rounded-full shrink-0 ${
                              reached ? "bg-[#D4AF37]" : "bg-zinc-800"
                            }`}
                          />
                          <span
                            className={`text-[8px] sm:text-[9px] text-center leading-tight whitespace-nowrap ${
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

                <div className="grid grid-cols-2 gap-4 text-sm border-t border-zinc-900 pt-4 mt-4">
                  <div>
                    <p className="text-xs text-zinc-500">Category</p>
                    <p className="font-medium mt-0.5">{order.category}</p>
                  </div>
                  {order.needDate && (
                    <div>
                      <p className="text-xs text-zinc-500">Needed By</p>
                      <p className="font-medium mt-0.5">{order.needDate}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status-specific panel */}
            {order.status === "Requested" && (
              <div className="print:hidden bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6 mb-5 text-center">
                <p className="text-sm text-zinc-300 font-semibold">
                  We&apos;re reviewing your request
                </p>
                <p className="text-xs text-zinc-500 mt-1.5">
                  You&apos;ll see a rate here as soon as we&apos;ve quoted it —
                  usually within a few hours.
                </p>
              </div>
            )}

            {order.status === "Quoted" && order.quoteAmount != null && (
              <div className="print:hidden bg-zinc-900/60 border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-6 mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-[#D4AF37] mb-3">
                  Invoice
                </h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm text-zinc-400">Rate for this order</span>
                  <span className="font-mono text-2xl font-bold text-white">
                    {money(order.quoteAmount)}
                  </span>
                </div>
                {order.quoteNote && (
                  <p className="text-xs text-zinc-500 border-t border-zinc-900 pt-3 mt-2">
                    {order.quoteNote}
                  </p>
                )}
                <div className="mt-5">
                  <ApproveQuoteButton requestNo={order.requestNo} />
                </div>
                <p className="text-center text-[11px] text-zinc-600 mt-3">
                  Approving lets us start work — payment isn&apos;t collected
                  until your files are ready.
                </p>
              </div>
            )}

            {order.approvedAt && order.quoteAmount != null && (
              <div className="bg-white text-black rounded-2xl p-6 sm:p-8 mb-5">
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-zinc-200">
                  <div>
                    <p className="font-bold text-lg">{PAYMENT_DETAILS.companyName}</p>
                    <p className="text-xs text-zinc-500 mt-1">Invoice</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Request No.</p>
                    <p className="font-mono font-bold">{order.requestNo}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(order.approvedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                      Billed To
                    </p>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-zinc-600 text-xs">{order.customerEmail}</p>
                    {order.customerPhone && (
                      <p className="text-zinc-600 text-xs">{order.customerPhone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                      Order Details
                    </p>
                    <p className="text-xs text-zinc-700">
                      {order.category}
                      {order.size ? ` · ${order.size}` : ""}
                    </p>
                    {order.formats.length > 0 && (
                      <p className="text-xs text-zinc-700">
                        Formats: {order.formats.join(", ")}
                      </p>
                    )}
                    {order.needDate && (
                      <p className="text-xs text-zinc-700">Needed by: {order.needDate}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700">
                      {order.category}
                      {order.quoteNote ? ` — ${order.quoteNote}` : ""}
                    </span>
                    <span className="font-mono">{money(order.quoteAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 mt-3 pt-3 font-bold text-base">
                    <span>Total Due</span>
                    <span className="font-mono">{money(order.quoteAmount)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                    Payment Details
                  </p>
                  <p className="text-xs text-zinc-600 mb-3">
                    {PAYMENT_DETAILS.instructions}
                  </p>
                  <div className="space-y-1.5">
                    {PAYMENT_DETAILS.methods.map((m) => (
                      <div key={m.label} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">{m.label}</span>
                        <span className="font-mono text-zinc-800">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <PrintInvoiceButton />
                </div>
              </div>
            )}

            {order.status === "Approved" && (
              <div className="print:hidden bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6 mb-5 text-center">
                <p className="text-sm text-zinc-300 font-semibold">
                  Rate approved — work is underway
                </p>
                <p className="text-xs text-zinc-500 mt-1.5">
                  We&apos;ll notify you here as soon as your files are ready.
                </p>
                {order.quoteAmount != null && (
                  <p className="text-xs text-zinc-600 mt-3">
                    Agreed rate: <span className="text-[#D4AF37] font-semibold">{money(order.quoteAmount)}</span>
                  </p>
                )}
              </div>
            )}

            {order.status === "Files Ready" && (
              <div className="print:hidden bg-zinc-900/60 border border-emerald-900/40 rounded-2xl p-5 sm:p-6 mb-5 text-center">
                <p className="text-sm text-emerald-300 font-semibold">
                  Your files are ready!
                </p>
                <p className="text-xs text-zinc-400 mt-1.5">
                  Please attach a screenshot of your payment to unlock your
                  downloads.
                </p>
                {order.quoteAmount != null && (
                  <p className="text-xs text-zinc-600 mt-3">
                    Amount due: <span className="text-[#D4AF37] font-semibold">{money(order.quoteAmount)}</span>
                  </p>
                )}
                <div className="text-left">
                  <PaymentScreenshotUpload requestNo={order.requestNo} />
                </div>
              </div>
            )}

            {order.status === "Payment Submitted" && (
              <div className="print:hidden bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6 mb-5 text-center">
                <p className="text-sm text-zinc-300 font-semibold">
                  Payment proof received — under review
                </p>
                <p className="text-xs text-zinc-500 mt-1.5">
                  We&apos;ll unlock your downloads as soon as it&apos;s
                  confirmed, usually within a few hours.
                </p>
              </div>
            )}

            {(order.status === "Payment Approved" || order.status === "Completed") && (
              <div className="print:hidden bg-zinc-900/60 border border-emerald-900/40 rounded-2xl p-5 sm:p-6 mb-5">
                <p className="text-sm text-emerald-300 font-semibold text-center">
                  Payment approved — your files are unlocked!
                </p>
                <p className="text-xs text-zinc-400 mt-1.5 text-center">
                  Tap a file below to download.
                </p>

                <div className="space-y-2 mt-4">
                  {order.files.map((f, i) => (
                    <a
                      key={f.url}
                      href={`/api/online-orders/public/${order.requestNo}/download?idx=${i}`}
                      className="flex items-center justify-between gap-2 bg-black/40 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-200 hover:border-[#D4AF37]/60 transition"
                    >
                      <span className="truncate">{f.name}</span>
                      <span className="text-[#D4AF37] font-semibold shrink-0">Download</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="print:hidden text-center text-xs text-zinc-600">
              Questions about this request? Contact GoVenture Embroidery &amp;
              Manufacturing directly.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
