import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getFirebaseAdminMessaging } from "@/lib/firebase/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export type NotifyPayload = {
  userIds: string[];
  title: string;
  body: string;
  href?: string | null;
  /** When false, only write the in-app inbox row. Default true. */
  sendPush?: boolean;
  /**
   * Optional authenticated client (e.g. staff session) used for in-app inserts
   * when the service-role key is not configured. Push still requires admin.
   */
  asUserClient?: SupabaseClient;
};

function tryCreateAdminClient() {
  try {
    return createAdminClient();
  } catch (error) {
    console.warn(
      "SUPABASE_SECRET_KEY missing — push fan-out and cross-user notifies need it.",
      error,
    );
    return null;
  }
}

/**
 * Create in-app inbox rows and optionally fan out FCM pushes
 * to registered device tokens for users who still have notifications enabled.
 */
export async function notifyUsers(input: NotifyPayload) {
  const userIds = [...new Set(input.userIds.filter(Boolean))];
  if (!userIds.length) {
    return { ok: true as const, inserted: 0, pushed: 0 };
  }

  const admin = tryCreateAdminClient();
  const writer = admin ?? input.asUserClient;
  if (!writer) {
    return {
      ok: false as const,
      message: "Notifications require SUPABASE_SECRET_KEY on the server.",
      inserted: 0,
      pushed: 0,
    };
  }

  const rows = userIds.map((user_id) => ({
    user_id,
    title: input.title.slice(0, 120),
    body: input.body.slice(0, 500),
    href: input.href?.slice(0, 500) ?? null,
    is_read: false,
  }));

  const { error } = await writer.from("notifications").insert(rows);
  if (error) {
    console.error("notifications insert failed:", error.message);
    return { ok: false as const, message: error.message, inserted: 0, pushed: 0 };
  }

  if (input.sendPush === false || !admin) {
    return { ok: true as const, inserted: rows.length, pushed: 0 };
  }

  const [{ data: settings }, { data: tokens }] = await Promise.all([
    admin
      .from("user_settings")
      .select("user_id, notifications_enabled")
      .in("user_id", userIds),
    admin.from("device_tokens").select("user_id, token").in("user_id", userIds),
  ]);

  const enabled = new Set(
    (settings ?? [])
      .filter((row) => row.notifications_enabled !== false)
      .map((row) => row.user_id),
  );
  // Users without a settings row default to enabled (matches schema default).
  for (const id of userIds) {
    if (!(settings ?? []).some((row) => row.user_id === id)) enabled.add(id);
  }

  const pushTokens = (tokens ?? [])
    .filter((row) => enabled.has(row.user_id) && row.token)
    .map((row) => row.token);

  if (!pushTokens.length) {
    return { ok: true as const, inserted: rows.length, pushed: 0 };
  }

  const messaging = getFirebaseAdminMessaging();
  if (!messaging) {
    console.warn(
      "Skipping FCM push — set FIREBASE_SERVICE_ACCOUNT_JSON to enable server push.",
    );
    return { ok: true as const, inserted: rows.length, pushed: 0 };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const stale: string[] = [];
  let pushed = 0;

  for (let i = 0; i < pushTokens.length; i += 500) {
    const batch = pushTokens.slice(i, i + 500);
    const response = await messaging.sendEachForMulticast({
      tokens: batch,
      notification: {
        title: input.title.slice(0, 120),
        body: input.body.slice(0, 500),
      },
      data: {
        href: input.href ?? "/dashboard",
        title: input.title.slice(0, 120),
        body: input.body.slice(0, 500),
      },
      webpush: {
        fcmOptions: {
          link: input.href ? `${appUrl}${input.href}` : appUrl || "/",
        },
        notification: {
          icon: "/vivrant-mark.png",
        },
      },
    });

    pushed += response.successCount;
    response.responses.forEach((result, index) => {
      if (
        !result.success &&
        (result.error?.code === "messaging/registration-token-not-registered" ||
          result.error?.code === "messaging/invalid-registration-token")
      ) {
        stale.push(batch[index]!);
      }
    });
  }

  if (stale.length) {
    await admin.from("device_tokens").delete().in("token", stale);
  }

  return {
    ok: true as const,
    inserted: rows.length,
    pushed,
  };
}

export async function notifyStaff(input: Omit<NotifyPayload, "userIds">) {
  const admin = tryCreateAdminClient();
  if (!admin) {
    return {
      ok: false as const,
      message: "Staff alerts require SUPABASE_SECRET_KEY.",
      inserted: 0,
      pushed: 0,
    };
  }

  const { data, error } = await admin
    .from("profiles")
    .select("user_id")
    .in("role", ["admin", "super_admin"])
    .eq("status", "active");

  if (error) {
    console.error("staff lookup failed:", error.message);
    return { ok: false as const, message: error.message, inserted: 0, pushed: 0 };
  }

  return notifyUsers({
    ...input,
    userIds: (data ?? []).map((row) => row.user_id),
  });
}
