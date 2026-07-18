// Sends the "Work Vault direct dispatch" email — a production bundle's
// files, emailed straight to a customer — using Resend's HTTP API.
//
// Why not real SMTP to Hostinger's mail server? This site runs on
// Cloudflare Pages/Workers (see src/lib/mongodb.ts), which cannot open
// raw TCP/SMTP sockets. Resend's HTTP API works everywhere fetch() does.
//
// To make emails genuinely come from your Hostinger domain:
//   1. Resend dashboard -> Domains -> Add Domain -> goventuresdispatch.com
//   2. Resend will show 2-3 DNS records (SPF/DKIM). Add those exact
//      records in Hostinger -> Domains -> DNS / Nameservers.
//   3. Wait for Resend to mark the domain "Verified" (usually minutes).
//   4. Set DISPATCH_FROM_EMAIL to info@goventuresdispatch.com below.
// Until the domain is verified, Resend will reject sends from it.

export interface DispatchFile {
  name: string;
  url: string;
}

interface SendDispatchEmailInput {
  recipientEmail: string;
  clientName: string;
  designName: string;
  jobDisplayId: string;
  files: DispatchFile[];
}

interface SendDispatchResult {
  success: boolean;
  error?: string;
}

function buildEmailHtml(input: SendDispatchEmailInput): string {
  const rows = input.files
    .map(
      (f) =>
        `<tr><td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;color:#e5e5e5;font-family:monospace;font-size:13px;">${escapeHtml(
          f.name
        )}</td><td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;text-align:right;"><a href="${f.url}" style="color:#D4AF37;text-decoration:none;font-weight:600;">Download</a></td></tr>`
    )
    .join("");

  return `
  <div style="background:#0a0a0a;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#141414;border:1px solid #262626;border-radius:16px;overflow:hidden;">
      <div style="padding:24px 24px 8px;">
        <p style="margin:0;color:#D4AF37;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:700;">GoVentures Direct Dispatch</p>
        <h1 style="margin:8px 0 4px;color:#fff;font-size:20px;">${escapeHtml(
          input.designName
        )}</h1>
        <p style="margin:0;color:#9ca3af;font-size:13px;">Hi ${escapeHtml(
          input.clientName
        )}, your production files are ready. Job ID: ${escapeHtml(
          input.jobDisplayId
        )}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        ${rows}
      </table>
      <div style="padding:18px 24px;background:#0f0f0f;">
        <p style="margin:0;color:#6b7280;font-size:12px;">Links stay active as long as the files remain in our system. Reply to this email if you need anything else.</p>
      </div>
    </div>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendDispatchEmail(
  input: SendDispatchEmailInput
): Promise<SendDispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.DISPATCH_FROM_EMAIL || "info@goventuresdispatch.com";
  const fromName = process.env.DISPATCH_FROM_NAME || "GoVentures Dispatch";

  if (!apiKey) {
    return { success: false, error: "Missing RESEND_API_KEY env var" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [input.recipientEmail],
        subject: `Your files are ready — ${input.designName} (${input.jobDisplayId})`,
        html: buildEmailHtml(input),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { success: false, error: `Resend API error ${res.status}: ${body}` };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error sending email",
    };
  }
}
