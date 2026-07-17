import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Brand } from "@/components/brand";
import { signIn, signUp } from "./actions";
import { SocialAuth } from "./social-auth";

export const metadata: Metadata = {
  title: "Welcome",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, notice, next } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/dashboard";

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-[#201d2a] p-12 text-white lg:flex lg:flex-col">
        <div className="animate-glow absolute -left-32 top-24 size-[30rem] rounded-full bg-[#7557ff]/25 blur-[100px]" />
        <div className="animate-glow-slow absolute -bottom-44 right-0 size-[32rem] rounded-full bg-[#20d8dd]/20 blur-[110px]" />
        <Brand tone="dark" className="relative" />
        <div className="relative my-auto max-w-xl">
          <span className="mb-7 grid size-12 place-items-center rounded-2xl bg-white/10 text-[#b6a8ff]">
            <Check size={22} />
          </span>
          <h1 className="font-display text-6xl leading-[1.02]">
            Your healthier rhythm starts quietly.
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/55">
            One private space to notice patterns, celebrate progress, and make
            your next choice with confidence.
          </p>
        </div>
        <p className="relative text-xs text-white/35">Every choice shapes your health.</p>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-5 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Brand className="lg:hidden" />
          <Link
            href="/"
            className="focus-ring ml-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-[#77727f] transition hover:bg-white"
          >
            <ArrowLeft size={15} /> Home
          </Link>
        </div>

        <div className="animate-rise mx-auto my-auto w-full max-w-md py-14">
          <p className="text-xs font-black tracking-[0.18em] text-[#7557ff]">WELCOME TO VIVA</p>
          <h2 className="font-display mt-4 text-5xl">Come back to yourself.</h2>
          <p className="mt-4 text-sm leading-6 text-[#7b7682]">
            Sign in to continue, or use the same form to create your account.
          </p>

          {(error || notice) && (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
              role="status"
            >
              {error ?? notice}
            </div>
          )}

          <div className="mt-8">
            <SocialAuth next={safeNext} />
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-black/8" />
            <span className="text-[10px] font-black tracking-[0.16em] text-[#aaa5af]">
              OR CONTINUE WITH EMAIL
            </span>
            <span className="h-px flex-1 bg-black/8" />
          </div>

          <form action={signIn} className="space-y-4">
            <input type="hidden" name="next" value={safeNext} />
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#615d69]">Name (for new accounts)</span>
              <span className="flex items-center gap-3 rounded-2xl border border-black/7 bg-white/70 px-4 py-3.5 shadow-sm transition focus-within:border-[#7557ff]/40 focus-within:ring-4 focus-within:ring-[#7557ff]/8">
                <UserRound size={17} className="text-[#9b96a1]" />
                <input
                  name="displayName"
                  autoComplete="name"
                  placeholder="Your name"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#615d69]">Email</span>
              <span className="flex items-center gap-3 rounded-2xl border border-black/7 bg-white/70 px-4 py-3.5 shadow-sm transition focus-within:border-[#7557ff]/40 focus-within:ring-4 focus-within:ring-[#7557ff]/8">
                <Mail size={17} className="text-[#9b96a1]" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#615d69]">Password</span>
              <span className="flex items-center gap-3 rounded-2xl border border-black/7 bg-white/70 px-4 py-3.5 shadow-sm transition focus-within:border-[#7557ff]/40 focus-within:ring-4 focus-within:ring-[#7557ff]/8">
                <LockKeyhole size={17} className="text-[#9b96a1]" />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="current-password"
                  placeholder="At least 8 characters"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </span>
            </label>
            <button className="focus-ring group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#24212e] px-5 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(36,33,46,.18)] transition hover:-translate-y-0.5 hover:bg-[#7557ff]">
              Sign in
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              formAction={signUp}
              className="focus-ring w-full rounded-2xl border border-black/8 bg-white/65 px-5 py-3.5 text-sm font-black text-[#4e4956] transition hover:bg-white hover:shadow-sm"
            >
              Create a new account
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-5 text-[#9a95a0]">
            By continuing, you agree to use VIVA for wellness guidance only.
            It does not replace professional medical care.
          </p>
        </div>
      </section>
    </main>
  );
}
