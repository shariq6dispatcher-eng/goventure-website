# RSM Module — Data Model (Part 1 of 8)

This documents how the GoventuresRSM business-ops app is ported into your
Next.js site's existing MongoDB Atlas database, using the same Data API
client your site already uses (`src/lib/mongodb.ts`) — no new database, no
new hosting, no Firebase.

## Where things live

- Types: `src/types/rsm.ts`
- Shared constants (categories, presets, collection names): `src/lib/rsm/constants.ts`
- Everything below is additive — nothing in your existing `Quote`, `Product`,
  `PortfolioItem` collections or routes is touched.

## New Mongo collections

All in the same database your `MONGODB_DATABASE` env var already points to.
No new environment variables are needed for Part 1 — the existing
`MONGODB_DATA_API_URL` / `MONGODB_DATA_API_KEY` / `MONGODB_DATA_SOURCE` cover
these too.

| Collection | Purpose | Written by |
|---|---|---|
| `rsm_customers` | Customer directory | Customers module (Part 2) |
| `rsm_orders` | Orders + invoice line items | Orders module (Part 3) |
| `rsm_payments` | Payments/receipts against orders | Payments module (Part 4) |
| `rsm_ledger` | Auto-generated running balance per customer | Written automatically whenever an order or confirmed payment is saved — never edited by hand |
| `rsm_expenses` | Business expenses | Expenses module (Part 5) |
| `rsm_digitizing_jobs` | Digitizing intake + work tracking (one record covers both RSM tabs) | Part 6 |
| `rsm_staff` | Per-staff module visibility (replaces RSM's hardcoded username checks) | Part 8 |
| `rsm_notifications` | In-panel notifications (new job, payment confirmed, etc.) | Various, optional polish |

## Key design decisions (and why)

**1. Human-facing IDs (`ORD-1001`, `PMT-5001`, `EXP-2001`) are generated as
`{PREFIX}-{YYMMDD}-{short random}`, not a sequential counter.**
The Mongo Data API (HTTPS, used because Cloudflare Workers can't open raw
TCP sockets) has no atomic `$inc` counter operation exposed yet through your
current `mongo` helper, and a "read last number, add one, write" pattern is
race-prone under concurrent staff use. A date+random suffix is unique
without a race condition. If you'd rather have strictly sequential numbers
later, that just needs one more method added to `mongo` (`findOneAndUpdate`
with `$inc`) — flagging it now, happy to add it in a later part if you want
true sequence numbers.

**2. `amountPaid` / `balanceDue` on `Order` are derived, not user-entered.**
They're recalculated server-side from `rsm_payments` every time a payment
is added/confirmed against that order, so the invoice and the ledger can
never drift apart the way manually-typed numbers could.

**3. `rsm_ledger` is a write-once audit trail, not a live view.**
One entry is appended per invoice (debit) and per confirmed payment
(credit), with the running `balance` stored at write time. This matches
what RSM already did, and means the Customer Ledgers tab and Reports Panel
just read history instead of recomputing totals across every order/payment
on every page load.

**4. File uploads (payment screenshots, expense receipts, digitizing
reference images/work files) go through your existing Cloudinary pipeline**
(`src/lib/cloudinary.ts`, already used by Portfolio/Products) instead of
RSM's old base64-in-Firestore approach. Only the resulting URL is stored in
Mongo.

**5. RSM's per-username `if (username === 'ali') ...` permission logic**
becomes a `role` + `allowedModules` field on `rsm_staff` (Part 8), enforced
in the UI and, importantly, re-checked server-side in each API route —
not just hidden in the sidebar.

## What's intentionally *not* carried over

- Firebase Auth / Google sign-in — your site already gates `/admin` via the
  `admin-auth` cookie; RSM staff visibility layers on top of that, it
  doesn't replace it.
- The Gemini AI key / `@google/genai` dependency — RSM had this available
  but none of its current panels call it. Skipped unless you want an
  AI-assisted feature added later.
- Google Drive sync modal — optional, can be revisited after the core
  modules are working if you still want it.

## Next part

**Part 2: Customers module** — API routes (`/api/rsm/customers`) +
the first RSM tab in the admin sidebar, styled to match your existing
zinc-950/gold theme.
