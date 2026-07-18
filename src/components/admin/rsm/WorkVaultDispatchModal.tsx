"use client";

import { useEffect, useState } from "react";
import {
  X,
  Folder,
  Send,
  Loader2,
  Clock,
  Copy,
  Check,
  Mail,
  ExternalLink,
} from "lucide-react";
import type { DispatchLog } from "@/types/rsm";

interface WorkVaultDispatchModalProps {
  jobId: string;
  designName: string;
  clientName: string;
  onClose: () => void;
}

const SENDER_EMAIL =
  process.env.NEXT_PUBLIC_DISPATCH_SENDER_EMAIL || "info@goventuresdispatch.com";
const WEBMAIL_PORTAL_URL =
  process.env.NEXT_PUBLIC_HOSTINGER_WEBMAIL_URL || "https://webmail.hostinger.com";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard API can fail in insecure contexts — silently ignore.
        }
      }}
      className="p-1.5 text-zinc-500 hover:text-[#D4AF37] transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export default function WorkVaultDispatchModal({
  jobId,
  designName,
  clientName,
  onClose,
}: WorkVaultDispatchModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [logs, setLogs] = useState<DispatchLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const loadLogs = () => {
    setLogsLoading(true);
    fetch(`/api/rsm/digitizing-jobs/${jobId}/dispatch`)
      .then((r) => r.json())
      .then((data) => setLogs(data.logs || []))
      .catch(() => {})
      .finally(() => setLogsLoading(false));
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleSend = async () => {
    setError("");
    setSuccess(false);
    if (!recipientEmail.trim()) {
      setError("Enter a recipient email first.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/rsm/digitizing-jobs/${jobId}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: recipientEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSuccess(true);
      setRecipientEmail("");
      loadLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between px-5 pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold mb-2">
              Goventures Direct Dispatch
            </p>
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Folder size={16} className="text-[#D4AF37]" />
              {designName}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Enter the client&apos;s email and send — every file in this folder goes out as an attachment.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-white transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-5 pt-4 overflow-y-auto">
          <div className="h-px bg-zinc-800 mb-4" />

          <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium mb-2">
            Recipient Customer Email
          </p>
          <div className="relative mb-1.5">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="customer@example.com dakhil karein"
              className="w-full bg-black/40 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            Client Name: <span className="text-white font-medium">{clientName}</span>
          </p>

          {error && (
            <div className="mb-3 text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded-lg px-3 py-2">
              Sent successfully.
            </div>
          )}

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-[#5B4FE8] hover:bg-[#4c41d6] disabled:opacity-60 text-white font-medium rounded-xl py-3 text-sm transition-colors mb-5"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            {sending ? "Sending…" : "Send Email with Files Attached"}
          </button>

          <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
            <Clock size={13} />
            <span className="uppercase tracking-wide font-medium">
              Previous Dispatch Logs ({logs.length})
            </span>
          </div>
          <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
            {logsLoading ? (
              <div className="p-4 text-center text-xs text-zinc-600">Loading…</div>
            ) : logs.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-600 italic">
                Is folder ki pehle koi email dispatch history nahi hai.
              </div>
            ) : (
              <div className="divide-y divide-zinc-900 max-h-40 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="text-zinc-300 truncate">{log.recipientEmail}</p>
                      <p className="text-zinc-600">
                        {new Date(log.createdAt).toLocaleString()} · {log.sentBy}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        log.status === "sent"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-900"
                          : "bg-red-950 text-red-300 border-red-900"
                      }`}
                    >
                      {log.status === "sent" ? "Sent" : "Failed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-black/30 border border-zinc-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">
                Hostinger Webmail Details
              </p>
              <a
                href={WEBMAIL_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-[#D4AF37] hover:underline"
              >
                Portal Kholein <ExternalLink size={11} />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-zinc-900/60 rounded-lg px-3 py-2 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] text-zinc-500">Sender Email</p>
                  <p className="text-xs text-white truncate">{SENDER_EMAIL}</p>
                </div>
                <CopyButton value={SENDER_EMAIL} />
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 mt-2 leading-relaxed">
              Emails send via Resend using this domain — no need to log into webmail
              manually. Use the portal link only if you need to check replies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
