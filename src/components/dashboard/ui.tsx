"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  highlight,
  action,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[11px] font-black tracking-[0.2em] text-[#5f45e6]">{eyebrow}</p>
        <h1 className="font-display mt-2 text-4xl leading-[1.05] sm:text-5xl">
          {title}{" "}
          {highlight && <span className="gradient-text italic">{highlight}</span>}
        </h1>
      </div>
      {action}
    </div>
  );
}

export function Stagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } },
      }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  suffix,
  detail,
  icon: Icon,
  className = "bg-[#fdfbf4] text-[#26222f]",
}: {
  label: string;
  value: string;
  suffix?: string;
  detail: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`rounded-[1.4rem] border border-[#26222f]/8 p-5 shadow-[0_14px_32px_rgba(64,49,38,.07)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wide opacity-65">{label}</span>
        <span className="grid size-8 place-items-center rounded-xl bg-black/5 opacity-80">
          <Icon size={16} />
        </span>
      </div>
      <p className="font-display mt-7 text-4xl leading-none tracking-tight">
        {value}
        {suffix && (
          <span className="ml-1 align-middle text-xs font-bold opacity-55">{suffix}</span>
        )}
      </p>
      <p className="mt-2.5 text-xs font-semibold opacity-60">{detail}</p>
    </motion.article>
  );
}

export function Panel({
  title,
  right,
  children,
  className = "",
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0 },
      }}
      className={`rounded-[1.4rem] border border-[#26222f]/8 bg-[#fdfbf4]/90 p-5 shadow-[0_12px_30px_rgba(64,49,38,.05)] sm:p-6 ${className}`}
    >
      {(title || right) && (
        <div className="mb-6 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-xl tracking-tight">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </motion.section>
  );
}

export const fieldClass =
  "w-full rounded-xl border border-[#26222f]/10 bg-[#f4efe4]/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-[#9a9488] hover:border-[#26222f]/18 focus:border-[#5f45e6]/45 focus:bg-[#fdfbf4] focus:ring-4 focus:ring-[#5f45e6]/10";

export function FormField({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block rounded-2xl border border-[#26222f]/6 bg-white/38 p-2.5 ${className}`}>
      <span className="mb-2 flex items-center justify-between gap-2 px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#716b78]">
          {label}
        </span>
        {hint && <span className="text-[10px] font-semibold text-[#aaa4ae]">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`focus-ring rounded-xl bg-[#26222f] px-4 py-3 text-sm font-black text-white shadow-[0_8px_18px_rgba(38,34,47,.14)] transition hover:-translate-y-0.5 hover:bg-[#5f45e6] hover:shadow-[0_12px_24px_rgba(95,69,230,.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function ListRow({
  title,
  meta,
  right,
}: {
  title: string;
  meta?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#26222f]/6 bg-[#f4efe4]/45 px-4 py-3 transition hover:border-[#26222f]/12 hover:bg-[#fdfbf4]">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{title}</p>
        {meta && <p className="mt-0.5 text-xs capitalize text-[#847f8c]">{meta}</p>}
      </div>
      {right}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-[#26222f]/12 bg-[#f4efe4]/35 px-4 py-8 text-center text-sm text-[#9a95a0]">
      {children}
    </p>
  );
}

export function Bars({
  data,
  activeIndex,
}: {
  data: [string, number][];
  activeIndex?: number;
}) {
  return (
    <div className="flex h-40 items-end justify-between gap-3">
      {data.map(([label, height], index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-3">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ delay: 0.15 + index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-10 rounded-full ${
              index === activeIndex
                ? "bg-gradient-to-t from-[#5f45e6] to-[#e4571f]"
                : "bg-[#eae4d6]"
            }`}
          />
          <span className="text-[10px] font-bold text-[#a19ca7]">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function Progress({
  value,
  className = "from-[#5f45e6] to-[#e4571f]",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#26222f]/8">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full rounded-full bg-gradient-to-r ${className}`}
      />
    </div>
  );
}
