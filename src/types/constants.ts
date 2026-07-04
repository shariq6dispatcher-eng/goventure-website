import type {
  ServiceCategory,
  OrderStatus,
  FileFormat,
  PaymentMethod,
  ExpenseCategory,
  DigitizingJobStatus,
} from "@/types/rsm";

// Mongo collection names — single source of truth so API routes and any
// future migration scripts never hardcode a string collection name.
export const RSM_COLLECTIONS = {
  customers: "rsm_customers",
  orders: "rsm_orders",
  payments: "rsm_payments",
  expenses: "rsm_expenses",
  ledger: "rsm_ledger",
  digitizingJobs: "rsm_digitizing_jobs",
  staff: "rsm_staff",
  notifications: "rsm_notifications",
} as const;

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Embroidery Digitizing",
  "Vector Art",
  "Custom Patches",
  "T-Shirts",
  "Hats",
  "Other",
];

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Delivered",
  "Cancelled",
];

export const FILE_FORMATS: FileFormat[] = [
  "DST",
  "PES",
  "EMB",
  "AI",
  "EPS",
  "PDF",
  "PNG",
  "CDR",
  "Other",
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  "Bank Transfer",
  "PayPal",
  "Payoneer",
  "Western Union",
  "Stripe",
  "Zelle",
  "Cash",
  "Other",
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Raw Materials",
  "Needles & Threads",
  "Blanks (Hats/Tshirts)",
  "Software Subscription",
  "Rent & Utilities",
  "Shipping & Courier",
  "Salaries",
  "Marketing",
  "T-Shirt Making (Production)",
  "Patches Making (Production)",
  "Hat Making (Production)",
  "Outsource Work",
  "Other",
];

export const DIGITIZING_JOB_STATUSES: DigitizingJobStatus[] = [
  "Pending",
  "Start Digitizing",
  "Completed",
  "Delivered",
];

// Reusable service/price presets so the Order form can quick-fill a line
// item instead of typing category/name/price every time. Carried over
// from GoventuresRSM's constants.ts — edit freely, this is just seed data
// for the dropdown, not a database table.
export const SERVICE_PRESETS: {
  id: string;
  category: ServiceCategory;
  name: string;
  price: number;
  unit: string;
  notes?: string;
}[] = [
  { id: "p1", category: "Embroidery Digitizing", name: "Left Chest Logo Digitizing", price: 25, unit: "Design", notes: "Standard DST/PES delivery" },
  { id: "p2", category: "Embroidery Digitizing", name: "Cap/Hat Logo Digitizing", price: 20, unit: "Design", notes: "Configured for low profile caps" },
  { id: "p3", category: "Embroidery Digitizing", name: "Jacket Back Large Digitizing", price: 75, unit: "Design", notes: "High density stitch detailing" },
  { id: "p4", category: "Vector Art", name: "Standard Vector Art Redraw", price: 30, unit: "Logo", notes: "Delivered in AI, EPS, SVG" },
  { id: "p5", category: "Vector Art", name: "Complex Mascot Vector Redraw", price: 60, unit: "Design", notes: "Detailed shadows and color layers" },
  { id: "p6", category: "Custom Patches", name: "Custom Embroidered Patches (50 Qty)", price: 150, unit: "Pack", notes: "Merrow border, iron-on backing" },
  { id: "p7", category: "Custom Patches", name: "Custom Leather Patches (100 Qty)", price: 350, unit: "Pack", notes: "Engraved real cowhide" },
  { id: "p8", category: "T-Shirts", name: "Custom Screen Printed T-Shirts (50 Qty)", price: 450, unit: "Pack", notes: "100% cotton, multi-size run" },
  { id: "p9", category: "T-Shirts", name: "Custom Embroidered T-Shirts (30 Qty)", price: 390, unit: "Pack", notes: "Premium heavy cotton blanks" },
  { id: "p10", category: "Hats", name: "Custom 3D Puff Embroidered Hats (24 Qty)", price: 360, unit: "Pack", notes: "Yupoong Classic hats included" },
];

// Site theme tokens, reused everywhere in the RSM panels so they look like
// a native part of the admin, not a bolted-on Firebase app.
export const RSM_THEME = {
  gold: "#D4AF37",
  bg: "bg-zinc-950",
  panelBg: "bg-zinc-900/60",
  border: "border-zinc-900",
  textMuted: "text-zinc-400",
} as const;
