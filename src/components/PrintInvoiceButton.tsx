"use client";

import { Printer } from "lucide-react";

export default function PrintInvoiceButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-[#D4AF37]/60 text-[#D4AF37] text-sm font-semibold py-3 rounded-xl transition-colors"
    >
      <Printer size={15} />
      Print / Save Invoice as PDF
    </button>
  );
}
