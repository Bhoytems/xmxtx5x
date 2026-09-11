"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/accounts", label: "Accounts" },
  { href: "/dashboard/strategy", label: "Strategy" },
  { href: "/dashboard/reports", label: "Reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-base-700 bg-base-950 px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-6 w-6 rounded-sm bg-signal-teal" />
        <span className="text-sm font-semibold text-ink-100">Desk</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 text-sm transition ${
                active
                  ? "bg-base-800 text-ink-100"
                  : "text-ink-500 hover:bg-base-800 hover:text-ink-300"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded border border-base-700 bg-base-900 p-3">
        <p className="text-xs text-ink-500">Signed in to</p>
        <p className="text-sm text-ink-100">Managed accounts desk</p>
      </div>
    </aside>
  );
}
