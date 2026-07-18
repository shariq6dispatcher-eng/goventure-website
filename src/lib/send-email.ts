// Sends the "Work Vault direct dispatch" email — a production bundle's
// actual files, attached and emailed straight to a customer — using
// Resend's HTTP API.
//
// Why not real SMTP to Hostinger's mail server? This site runs on
// Cloudflare Pages/Workers (see src/lib/mongodb.ts), which cannot open
// raw TCP/SMTP sockets. Resend's HTTP API works everywhere fetch() does,
// including for downloading each file (plain https fetch) and attaching
// it as base64.
//
// To make emails genuinely come from your Hostinger domain:
//   1. Resend dashboard -> Domains -> Add Domain -> goventuresdispatch.com
//   2. Resend will show 2-3 DNS records (SPF/DKIM). Add those exact
//      records in Hostinger -> Domains -> DNS / Nameservers.
//   3. Wait for Resend to mark the domain "Verified" (usually minutes).
//   4. Set DISPATCH_FROM_EMAIL to info@goventuresdispatch.com below.
// Until the domain is verified, Resend will reject sends from it.
//
// Resend caps the total request (all attachments combined, base64
// included) at roughly 40MB. Embroidery bundles (DST/PES/EMB/PDF) are
// almost always well under that, but very large jobs could hit the
// limit — see the explicit error thrown below if a file can't be
// downloaded, so a bad link never fails silently.

export interface DispatchFile {
  name: string;
  url: string;
}

interface SendDispatchEmailInput {
  recipientEmail: string;
  designName: string;
  files: DispatchFile[];
}

interface SendDispatchResult {
  success: boolean;
  error?: string;
}

// Fetch a file and return it as a base64 string, the format Resend's
// attachments API expects.
async function fetchAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not download ${url} (status ${res.status})`);
  }
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
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
    const attachments = await Promise.all(
      input.files.map(async (f) => ({
        filename: f.name,
        content: await fetchAsBase64(f.url),
      }))
    );

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [input.recipientEmail],
        subject: `Digitizing Files (${input.designName})`,
        text: "Please find the attachment for the files.",
        attachments,
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
