"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Dumbbell, Sparkles, Utensils } from "lucide-react";

const items = [
  {
    icon: Sparkles,
    title: "New insight ready",
    detail: "Your energy peaks after morning walks.",
    time: "2m ago",
    tone: "text-[#5f45e6] bg-[#ece7fb]",
  },
  {
    icon: Utensils,
    title: "Lunch reminder",
    detail: "A protein-rich meal keeps the afternoon steady.",
    time: "1h ago",
    tone: "text-[#12a595] bg-[#e6faf6]",
  },
  {
    icon: Dumbbell,
    title: "Movement goal",
    detail: "1,800 steps left to reach today's target.",
    time: "3h ago",
    tone: "text-[#ff7a59] bg-[#fff0e8]",
  },
];

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(() => new Set(items.map((item) => item.title)));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        aria-label="Notifications"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring relative grid size-10 place-items-center rounded-full bg-[#fdfbf4] text-[#676270] shadow-sm transition hover:-translate-y-0.5"
      >
        <Bell size={17} />
        {unread.size > 0 && (
          <i className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[#ff647c]" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass absolute right-0 top-12 z-50 w-80 rounded-2xl p-3"
          >
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-sm font-black">Notifications</span>
              {unread.size > 0 ? (
                <button
                  type="button"
                  onClick={() => setUnread(new Set())}
                  className="rounded-full bg-[#ece7fb] px-2.5 py-1 text-[10px] font-bold text-[#5f45e6] transition hover:bg-[#ded5fa]"
                >
                  Mark {unread.size} read
                </button>
              ) : (
                <span className="px-2 py-1 text-[10px] font-bold text-[#9d98a3]">All read</span>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {items.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() =>
                    setUnread((current) => {
                      const next = new Set(current);
                      next.delete(item.title);
                      return next;
                    })
                  }
                  className={`relative flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition hover:bg-[#fdfbf4]/85 ${
                    unread.has(item.title) ? "bg-white/45" : "opacity-65"
                  }`}
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${item.tone}`}>
                    <item.icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold">{item.title}</span>
                    <span className="block truncate text-[11px] text-[#847f8c]">
                      {item.detail}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] text-[#a9a4b0]">{item.time}</span>
                  {unread.has(item.title) && (
                    <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#5f45e6]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
