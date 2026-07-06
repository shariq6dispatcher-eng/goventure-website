"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  BookOpen,
  Receipt,
  Users,
  BarChart3,
  Sparkles,
  Hammer,
  UserCog,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface RsmSidebarProps {
  staffName: string;
  staffRole: "admin" | "staff";
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  comingSoon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/RSM", icon: LayoutDashboard },
  { label: "Orders", href: "/RSM/orders", icon: ClipboardList},
  { label: "Payments", href: "/RSM/payments", icon: Wallet, comingSoon: true },
  { label: "Customer Ledgers", href: "/RSM/ledgers", icon: BookOpen, comingSoon: true },
  { label: "Expenses", href: "/RSM/expenses", icon: Receipt, comingSoon: true },
  { label: "Customers", href: "/RSM/customers", icon: Users },
  { label: "Reports", href: "/RSM/reports", icon: BarChart3, comingSoon: true },
  { label: "Digitizing Orders", href: "/RSM/digitizing", icon: Sparkles, comingSoon: true },
  { label: "Digitizing Work", href: "/RSM/digitizing-work", icon: Hammer, comingSoon: true },
  { label: "Users", href: "/RSM/users", icon: UserCog, comingSoon: true },
];

export default function RsmSidebar({ staffName, staffRole }: RsmSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
        {NAV_ITEMS.map(({ label, href, icon: Icon, comingSoon }) => {
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
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-16 bg-zinc-950 border-b border-zinc-900">
        <span className="text-sm font-semibold">
          GoVenture <span className="text-[#D4AF37]">RSM</span>
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-zinc-300"
        >
          <Menu size={22} />
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
