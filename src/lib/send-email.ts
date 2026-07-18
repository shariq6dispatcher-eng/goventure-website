// Thin wrapper around Resend's HTTP API. No npm package needed — this
// uses plain fetch, so it works from GitHub-only edits + Cloudflare
// Pages builds without touching package.json or the lockfile.
// 
// Fire-and-forget: if this fails (missing key, Resend down, etc.) it
// only logs an error — it must never break the calling action (e.g. a
// new order should still save even if the email fails to send).

export async function sendAdminEmail(subject: string, message: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ADMIN_NOTIFY_EMAIL;

  if (!apiKey || !toEmail) {
    console.error("sendAdminEmail: missing RESEND_API_KEY or ADMIN_NOTIFY_EMAIL env var");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GoVenture RSM <onboarding@resend.dev>",
        to: [toEmail],
        subject,
        text: message,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("sendAdminEmail: Resend API error", res.status, body);
    }
  } catch (err) {
    console.error("sendAdminEmail: failed to send", err);
  }
}
