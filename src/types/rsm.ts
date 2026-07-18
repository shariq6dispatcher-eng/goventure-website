/**
 * Shared types for the RSM (business ops) module of the admin panel.
 *
 * Ported from GoventuresRSM (Firebase/Firestore + React) into the shape
 * this site already uses for Mongo-backed admin data: every record has a
 * string `_id` (the Mongo ObjectId, normalized to a string by
 * `src/lib/mongodb.ts`), matching `Quote`, `Product`, etc.
 *
 * These types are the contract between:
 *   - the API routes under src/app/api/rsm/*
 *   - the admin UI panels under src/components/admin/rsm/*
 */
 
export type ServiceCategory =
  | "Embroidery Digitizing"
  | "Vector Art"
  | "Custom Patches"
  | "T-Shirts"
  | "Hats"
  | "Other";

export type OrderStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Delivered"
  | "Cancelled";

export type FileFormat =
  | "DST"
  | "PES"
  | "EMB"
  | "AI"
  | "EPS"
  | "PDF"
  | "PNG"
  | "CDR"
  | "Other";

export type PaymentMethod =
  | "Bank Transfer"
  | "PayPal"
  | "Payoneer"
  | "Western Union"
  | "Stripe"
  | "Zelle"
  | "Cash"
  | "Other";

export type ExpenseCategory =
  | "Raw Materials"
  | "Needles & Threads"
  | "Blanks (Hats/Tshirts)"
  | "Software Subscription"
  | "Rent & Utilities"
  | "Shipping & Courier"
  | "Salaries"
  | "Marketing"
  | "T-Shirt Making (Production)"
  | "Patches Making (Production)"
  | "Hat Making (Production)"
  | "Outsource Work"
  | "Other";

export type DigitizingJobStatus =
  | "Pending"
  | "Start Digitizing"
  | "Completed"
  | "Delivered";

// RSM-specific roles for who can see which module in the panel.
// Distinct from the site's single ADMIN_PASSWORD gate: this controls
// per-staff visibility *inside* the RSM section once someone is already
// past /admin-login. See Part 8 (Users Registry) for how this is enforced.
export type RsmRole = "admin" | "staff";

export type RsmModule =
  | "dashboard"
  | "orders"
  | "payments"
  | "ledgers"
  | "expenses"
  | "customers"
  | "reports"
  | "digitizing"
  | "digitizing_work"
  | "online_orders"
  | "users";

// ---------------------------------------------------------------------------
// Customers  (collection: rsm_customers)
// ---------------------------------------------------------------------------
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  country?: string;
  createdAt: string; // ISO date
  updatedAt?: string;
}

export type CustomerInput = Omit<Customer, "_id" | "createdAt" | "updatedAt">;

// ---------------------------------------------------------------------------
// Orders  (collection: rsm_orders)
// ---------------------------------------------------------------------------
export interface OrderItem {
  id: string; // client-generated line id (uuid), not a Mongo id
  category: ServiceCategory;
  name: string;
  quantity: number;
  price: number;
  format?: FileFormat;
  details?: string;
}

export interface Order {
  _id: string;
  orderNo: string; // human-facing sequential id, e.g. "ORD-1001"
  customerId: string; // Customer._id
  customerName: string; // denormalized for fast list rendering
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number; // kept in sync from rsm_payments on write
  balanceDue: number;
  orderDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  designName?: string;
  stitchCount?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type OrderInput = Omit<
  Order,
  | "_id"
  | "orderNo"
  | "customerName"
  | "amountPaid"
  | "balanceDue"
  | "createdAt"
  | "updatedAt"
>;

// ---------------------------------------------------------------------------
// Payments  (collection: rsm_payments)
// ---------------------------------------------------------------------------
export interface Payment {
  _id: string;
  paymentNo: string; // e.g. "PMT-5001"
  customerId: string;
  customerName: string;
  orderId?: string; // Order._id, optional (general payment / on-account)
  amount: number;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  reference?: string;
  screenshot?: string; // Cloudinary URL (reuses existing site upload pipeline)
  notes?: string;
  bookedMonth?: string; // YYYY-MM, optional override for which month this payment is counted in on Reports/ledger (e.g. confirming a missed June payment in July but wanting it to show under June). Falls back to date's month when unset.
  confirmed: boolean;
  confirmedBy?: string;
  confirmedAt?: string; // ISO datetime, set when marked confirmed — used for cash-collection month bucketing
  loggedBy?: string; // RsmStaff.username who created this record — set server-side
  createdAt: string;
}

export type PaymentInput = Omit <
  Payment,
  "_id" | "paymentNo" | "customerName" | "confirmed" | "confirmedBy" | "confirmedAt" | "loggedBy" | "createdAt"
>;

// ---------------------------------------------------------------------------
// Expenses  (collection: rsm_expenses)
// ---------------------------------------------------------------------------
export interface Expense {
  _id: string;
  expenseNo: string; // e.g. "EXP-2001"
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  refNo?: string;
  screenshot?: string; // Cloudinary URL
  loggedBy?: string; // RsmStaff.username who created this record — set server-side
  createdAt: string;
}

export type ExpenseInput = Omit <
  Expense,
  "_id" | "expenseNo" | "loggedBy" | "createdAt"
>;

// ---------------------------------------------------------------------------
// Customer Ledger  (collection: rsm_ledger)
// Auto-generated one entry per Order (debit) and per confirmed Payment
// (credit); never edited directly through the UI. Running `balance` is
// computed and stored at write time so history renders without recompute.
// ---------------------------------------------------------------------------
export interface LedgerEntry {
  _id: string;
  customerId: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  type: "Invoice" | "Payment";
  referenceId: string; // Order._id or Payment._id
  referenceNo: string; // Order.orderNo or Payment.paymentNo, for display
  description: string;
  debit: number;
  credit: number;
  balance: number; // running balance after this entry, per customer
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Digitizing Jobs  (collection: rsm_digitizing_jobs)
// Covers both "Digitizing Order" intake and "Digitizing Work" tracking
// tabs from the original RSM app — one record moves through both stages
// via `status`.
// ---------------------------------------------------------------------------
export interface DigitizingJobFile {
  name: string;
  url: string; // Cloudinary URL
  uploadedAt: string;
}

export interface DigitizingJobFolder {
  name: string;
  files: DigitizingJobFile[];
}

export interface DigitizingJob {
  _id: string;
  customerId: string;
  customerName: string;
  designName: string;
  imageUrl?: string; // Cloudinary URL, reference image of the design
  uploadedBy: string; // RsmStaff.username
  status: DigitizingJobStatus;
  orderId?: string; // linked Order._id once invoiced
  folders: DigitizingJobFolder[];
  price: number;
  format: FileFormat;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type DigitizingJobInput = Omit<
  DigitizingJob,
  "_id" | "createdAt" | "updatedAt"
>;

// ---------------------------------------------------------------------------
// RSM Staff / Users Registry  (collection: rsm_staff)
// Not the same as the site's `admin-auth` cookie gate — this is a second,
// lighter layer that only decides which RSM modules a signed-in admin
// user sees, replacing RSM's old hardcoded per-username `if` checks.
// ---------------------------------------------------------------------------
export interface RsmStaff {
  _id: string;
  username: string;
  password: string; // plain string for now — MVP; can be hashed later
  name: string;
  email?: string;
  role: RsmRole;
  allowedModules: RsmModule[]; // ignored when role === "admin" (sees all)
  hideFinancials?: boolean; // when true, this staff member's UI/API responses redact order amounts, prices, and customer contact details (used for digitizer accounts). Ignored when role === "admin".
  active: boolean;
  lastActive?: string;
  createdAt: string;
}

export type RsmStaffInput = Omit<RsmStaff, "_id" | "createdAt">;

// ---------------------------------------------------------------------------
// Notifications  (collection: rsm_notifications)
// ---------------------------------------------------------------------------
export interface RsmNotification {
  _id: string;
  title: string;
  message: string;
  forUsername: string;
  read: boolean;
  jobId?: string;
  orderId?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Online Orders  (collection: rsm_online_orders)
// The public-facing "Place an Order" pipeline: a customer with no login
// submits a request (design image, size, formats, need-by date/urgent
// note) from /order. Admin reviews it in the RSM "Online Orders" tab,
// quotes a rate, the customer approves + pays, admin uploads the
// finished files, customer confirms payment with a screenshot, admin
// approves the screenshot, then the customer can download the files
// (individually or as a ZIP) from the same public link. Every step that
// needs the other side's attention fires an RsmNotification / is visible
// on the public status page — no email/login system required.
// ---------------------------------------------------------------------------
export type OnlineOrderStatus =
  | "Requested" // customer submitted the request, awaiting admin quote
  | "Quoted" // admin set a rate, awaiting customer approval
  | "Approved" // customer approved the rate, work can begin
  | "Files Ready" // admin uploaded finished files, awaiting payment proof
  | "Payment Submitted" // customer attached a payment screenshot, awaiting admin approval
  | "Payment Approved" // admin approved payment, files unlocked for download
  | "Completed" // customer has downloaded the files
  | "Rejected"; // admin declined the request

export interface OnlineOrderFile {
  name: string;
  url: string; // Cloudinary URL (raw resource type)
  uploadedAt: string;
}

export interface OnlineOrder {
  _id: string;
  requestNo: string; // human-facing id, e.g. "REQ-1001" — doubles as the public tracking code
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  category: ServiceCategory;
  designImageUrl?: string; // Cloudinary URL of the reference design the customer uploaded
  size?: string; // e.g. "4x4 in", "Left Chest", "10cm"
  formats: FileFormat[]; // file formats the customer needs delivered
  needDate?: string; // YYYY-MM-DD, when they need it by
  urgent: boolean; // "Urgent — need by today" flag
  notes?: string; // free-text note from the customer
  status: OnlineOrderStatus;
  quoteAmount?: number; // rate admin sets for this request
  quoteNote?: string; // optional note attached to the quote (e.g. what's included)
  quotedAt?: string;
  approvedAt?: string; // when the customer approved the quote
  rejectedReason?: string;
  files: OnlineOrderFile[]; // finished files, uploaded by admin once work is done
  filesReadyAt?: string;
  paymentScreenshot?: string; // Cloudinary URL of the customer's payment proof
  paymentSubmittedAt?: string;
  paymentApprovedAt?: string;
  paymentApprovedBy?: string; // RsmStaff.username who approved the payment
  downloadedAt?: string; // set the first time the customer downloads files, flips status to Completed
  createdAt: string;
  updatedAt?: string;
}

export type OnlineOrderInput = Omit<
  OnlineOrder,
  | "_id"
  | "requestNo"
  | "status"
  | "files"
  | "createdAt"
  | "updatedAt"
>;

// ---------------------------------------------------------------------------
// Work Vault direct-dispatch: emailing a job's production bundle straight
// to the customer's inbox from the RSM panel.
// ---------------------------------------------------------------------------
export type DispatchStatus = "sent" | "failed";

export interface DispatchLog {
  _id: string;
  jobId: string;
  recipientEmail: string;
  fileCount: number;
  sentBy: string; // RsmStaff.username
  status: DispatchStatus;
  error?: string;
  createdAt: string;
}
