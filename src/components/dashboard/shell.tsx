"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Apple,
  ChevronRight,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Search,
  Settings2,
  ShoppingBasket,
  WalletCards,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { signOut } from "@/app/dashboard/actions";
import { Notifications } from "@/components/dashboard/notifications";

const navItems = [
  { icon: LayoutDashboard, label: "Today", href: "/dashboard" },
  { icon: Apple, label: "Nutrition", href: "/dashboard/nutrition" },
  { icon: Dumbbell, label: "Movement", href: "/dashboard/movement" },
  { icon: ShoppingBasket, label: "Groceries", href: "/dashboard/groceries" },
  { icon: WalletCards, label: "Spending", href: "/dashboard/spending" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function DashboardShell({
  displayName,
  children,
}: {
  displayName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const initials = displayName.trim().charAt(0).toUpperCase() || "V";

  return (
    <main className="min-h-screen p-3 sm:p-5">
      <div className="glass mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1500px] overflow-hidden rounded-[2rem]">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-black/5 bg-white/45 p-5 lg:flex">
          <Brand className="mb-10" />
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-ring relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                    active
                      ? "text-white"
                      : "text-[#716d78] hover:bg-white/80 hover:text-[#332f3c]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-xl bg-[#24212e] shadow-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <item.icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl bg-gradient-to-br from-[#292433] to-[#3e3156] p-4 text-white">
            <p className="text-sm font-bold">Your weekly story is ready.</p>
            <Link
              href="/dashboard"
              className="mt-3 flex items-center gap-1 text-xs font-bold text-white/60 transition hover:text-white"
            >
              Open report <ChevronRight size={13} />
            </Link>
          </div>
          <button className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#77727e] transition hover:bg-white/70">
            <Settings2 size={17} /> Preferences
          </button>
        </aside>

        <section className="min-w-0 flex-1 bg-[#f8f7fb]/65">
          <header className="flex h-20 items-center justify-between gap-3 border-b border-black/5 px-5 sm:px-8">
            <Brand compact className="lg:hidden" />
            <label className="hidden items-center gap-2 rounded-full border border-black/5 bg-white/75 px-4 py-2.5 text-[#8c8793] sm:flex">
              <Search size={16} />
              <input
                aria-label="Search VIVA"
                placeholder="Search your wellbeing"
                className="w-44 bg-transparent text-sm outline-none placeholder:text-[#aaa6b0]"
              />
            </label>
            <div className="flex items-center gap-2">
              <Notifications />
              <form action={signOut}>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  title="Sign out"
                  className="focus-ring group ml-1 flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 text-sm font-bold shadow-sm"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#ac99ff] to-[#5fd8e0] text-xs font-black text-white">
                    {initials}
                  </span>
                  <span className="hidden max-w-28 truncate sm:block">{displayName}</span>
                  <LogOut size={14} className="text-[#a7a2ae] transition group-hover:text-[#7557ff]" />
                </motion.button>
              </form>
            </div>
          </header>

          <nav className="flex gap-2 overflow-x-auto border-b border-black/5 px-4 py-3 lg:hidden">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-ring flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                    active
                      ? "bg-[#24212e] text-white"
                      : "bg-white/70 text-[#716d78]"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="p-5 sm:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
