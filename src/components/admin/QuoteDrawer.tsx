"use client";

import { X, Mail, Phone, Building2, Globe, Package, CalendarDays, Trash2, ZoomIn } from "lucide-react";
import StatusBadge from "./StatusBadge";

export interface Quote {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  description?: string;
  quantity?: string | number;
  country?: string;
  deliveryDate?: string;
  artwork?: string;
  status: string;
  createdAt?: string;
}

const STATUSES = ["New", "In Progress", "Quoted", "Completed", "Declined"];

interface QuoteDrawerProps {
  quote: Quote | null;
  updatingStatus: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
  onViewArtwork: (url: string) => void;
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-zinc-500" />
      </div>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm text-zinc-200 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function QuoteDrawer({
  quote,
  updatingStatus,
  onClose,
  onStatusChange,
  onDelete,
  onViewArtwork,
}: QuoteDrawerProps) {
  if (!quote) return null;

  return (
    <div
      className="fixed inset-0 z-[9995] bg-black/80 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full bg-zinc-950 border-l border-zinc-800 overflow-y-auto animate-in slide-in-from-right"
      >
        <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-semibold">{quote.name}</h3>
            {quote.createdAt && (
              <p className="text-xs text-zinc-500 mt-0.5">
                Submitted{" "}
                {new Date(quote.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-7">
          <div>
            <label className="block text-xs text-zinc-500 mb-2">Status</label>
            <div className="flex items-center gap-3">
              <StatusBadge status={quote.status} />
              <select
                value={quote.status}
                disabled={updatingStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] outline-none p-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Field icon={Mail} label="Email" value={quote.email} />
            <Field icon={Phone} label="Phone" value={quote.phone} />
            <Field icon={Building2} label="Company" value={quote.company} />
            <Field icon={Globe} label="Country" value={quote.country} />
            <Field icon={Package} label="Quantity" value={quote.quantity} />
            <Field
              icon={CalendarDays}
              label="Requested Delivery"
              value={quote.deliveryDate}
            />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">Service Requested</p>
            <p className="text-sm text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              {quote.service}
            </p>
          </div>

          {quote.description && (
            <div>
              <p className="text-xs text-zinc-500 mb-2">Project Description</p>
              <p className="text-sm text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap">
                {quote.description}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-zinc-500 mb-2">Uploaded Artwork</p>
            {quote.artwork ? (
              <button
                onClick={() => onViewArtwork(quote.artwork!)}
                className="relative group w-full rounded-xl overflow-hidden border border-zinc-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={quote.artwork}
                  alt="Uploaded artwork"
                  className="w-full h-48 object-contain bg-zinc-900"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
                    <ZoomIn size={16} /> View full size
                  </span>
                </div>
              </button>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">
                No artwork was attached to this request.
              </div>
            )}
          </div>

          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 border border-red-900/60 hover:bg-red-950/50 transition-colors"
          >
            <Trash2 size={15} />
            Delete Quote Request
          </button>
        </div>
      </div>
    </div>
  );
}
