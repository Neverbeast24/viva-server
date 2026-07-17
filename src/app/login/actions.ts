"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function safeNext(formData: FormData) {
  const next = value(formData, "next");
  return next.startsWith("/") ? next : "/dashboard";
}

function loginRedirect(
  message: string,
  type: "error" | "notice" = "error",
): never {
  redirect(`/login?${type}=${encodeURIComponent(message)}`);
}

export async function signIn(formData: FormData) {
  const email = value(formData, "email");
  const password = value(formData, "password");
  const next = safeNext(formData);

  if (!email || !password) {
    loginRedirect("Enter your email and password.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    loginRedirect(error.message);
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  const email = value(formData, "email");
  const password = value(formData, "password");
  const displayName = value(formData, "displayName");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!email || password.length < 8) {
    loginRedirect("Use a valid email and a password with at least 8 characters.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${appUrl}/auth/confirm`,
    },
  });

  if (error) {
    loginRedirect(error.message);
  }

  loginRedirect("Check your inbox to confirm your VIVA account.", "notice");
}
