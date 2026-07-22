"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const registerSchema = z.object({
  token: z.string().trim().min(20).max(4096),
  platform: z.enum(["web", "android", "ios"]).default("web"),
});

export async function registerDeviceToken(input: {
  token: string;
  platform?: "web" | "android" | "ios";
}) {
  const parsed = registerSchema.safeParse({
    token: input.token,
    platform: input.platform ?? "web",
  });
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid device token." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, message: "Not signed in." };

  const now = new Date().toISOString();
  const { error } = await supabase.from("device_tokens").upsert(
    {
      user_id: user.id,
      token: parsed.data.token,
      platform: parsed.data.platform,
      last_seen_at: now,
    },
    { onConflict: "token" },
  );

  if (error) {
    console.error("device_tokens upsert failed:", error.message);
    return { ok: false as const, message: "Could not save this device for push." };
  }

  return { ok: true as const, message: "Device registered for push." };
}

export async function unregisterDeviceToken(token: string) {
  const parsed = z.string().trim().min(20).max(4096).safeParse(token);
  if (!parsed.success) return { ok: false as const, message: "Invalid token." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, message: "Not signed in." };

  const { error } = await supabase
    .from("device_tokens")
    .delete()
    .eq("user_id", user.id)
    .eq("token", parsed.data);

  if (error) {
    console.error("device_tokens delete failed:", error.message);
    return { ok: false as const, message: "Could not remove this device." };
  }

  return { ok: true as const };
}
