"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  BookOpen,
  Receipt,
  Users,
  BarChart3,
  Sparkles,
  FolderOpen, 
  UserCog,
  LogOut,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";

interface RsmSidebarProps {
  staffName: string;
  staffRole: "admin" | "staff";
}

import type { RsmModule } from "@/types/rsm";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  comingSoon?: boolean;
  module?: RsmModule; // omitted = always visible to any logged-in staff (e.g. Dashboard)
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/RSM", icon: LayoutDashboard },
  { label: "Orders", href: "/RSM/orders", icon: ClipboardList, module: "orders" },
  { label: "Payments", href: "/RSM/payments", icon: Wallet, module: "payments" },
  { label: "Customer Ledger", href: "/RSM/ledger", icon: BookOpen, module: "ledgers" },
  { label: "Expenses", href: "/RSM/expenses", icon: Receipt, module: "expenses" },
  { label: "Customers", href: "/RSM/customers", icon: Users, module: "customers" },
  { label: "Reports", href: "/RSM/reports", icon: BarChart3, module: "reports" },
  { label: "Digitizing Jobs", href: "/RSM/digitizing-jobs", icon: Sparkles, module: "digitizing" },
  { label: "Work Vault", href: "/RSM/work-vault", icon: FolderOpen, module: "digitizing_work" },
  { label: "Online Orders", href: "/RSM/online-orders", icon: ShoppingBag, module: "online_orders" },
  { label: "Users", href: "/RSM/users", icon: UserCog, adminOnly: true },
];

export default function RsmSidebar({ staffName, staffRole }: RsmSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [allowedModules, setAllowedModules] = useState<RsmModule[] | null>(
    staffRole === "admin" ? null : []
  );
  const [hideFinancials, setHideFinancials] = useState(false);

  useEffect(() => {
    fetch("/api/rsm/me")
      .then((r) => r.json())
      .then((data) => {
        setAllowedModules(data.allowedModules);
        setHideFinancials(!!data.hideFinancials);
      })
      .catch(() => {});
  }, []);

  // null = admin, unrestricted. Otherwise only show items either with no
  // module tag (always visible) or explicitly in this staff member's list.
  // adminOnly items are hidden outright for non-admins regardless of module.
  // Dashboard is financial end-to-end, so it's hidden for hideFinancials
  // accounts even though it has no `module` tag of its own.
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly) return staffRole === "admin";
    if (item.href === "/RSM" && hideFinancials) return false;
    if (!item.module) return true;
    if (allowedModules === null) return true;
    return allowedModules.includes(item.module);
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/rsm/logout", { method: "POST" });
    } finally {
      router.push("/RSM/login");
      router.refresh();
    }
  };

  const NavContent = (
    <>
      <div className="px-6 pt-8 pb-6">
        <p className="text-xs uppercase tracking-[3px] text-[#D4AF37]">
          GoVenture
        </p>
        <h1 className="text-xl font-bold mt-1">RSM Panel</h1>
        <p className="text-zinc-500 text-xs mt-2">
          {staffName} <span className="text-zinc-700">·</span>{" "}
          {staffRole === "admin" ? "Admin" : "Staff"}
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
       {visibleItems.map(({ label, href, icon: Icon, comingSoon }) => {
          const active = pathname === href;

          if (comingSoon) {
            return (
              <div
                key={label}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 cursor-not-allowed"
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {label}
                </span>
                <span className="text-[10px] uppercase tracking-wide bg-zinc-900 text-zinc-600 px-2 py-0.5 rounded-full">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[#D4AF37] text-black"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-900">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50"
        >
          <LogOut size={17} />
          {loggingOut ? "Logging out…" : "Log Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
     {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-zinc-950/95 backdrop-blur border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-xs font-black">
            G
          </span>
          <div className="leading-tight">
            <span className="block text-[13px] font-bold text-white">
              GoVenture <span className="text-[#D4AF37]">RSM</span>
            </span>
            <span className="block text-[10px] text-zinc-500">{staffName}</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-zinc-300 p-2 -mr-2 rounded-lg active:bg-zinc-900"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-zinc-950 border-r border-zinc-900">
        {NavContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-72 h-full bg-zinc-950 border-r border-zinc-900">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-6 right-4 text-zinc-400"
            >
              <X size={20} />
            </button>
            {NavContent}
          </aside>
        </div>
      )}
    </>
  );
}
