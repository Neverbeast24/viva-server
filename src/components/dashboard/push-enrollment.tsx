"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { registerDeviceToken } from "@/app/dashboard/device-token-actions";
import {
  onForegroundNotification,
  requestNotificationToken,
} from "@/lib/firebase/messaging";

/**
 * Silently requests web push permission (when allowed) and keeps the FCM
 * token synced to Supabase. Also surfaces foreground pushes as toasts.
 */
export function PushEnrollment({ enabled = true }: { enabled?: boolean }) {
  const enrolled = useRef(false);

  useEffect(() => {
    if (!enabled || enrolled.current) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    let unsubscribe: (() => void) | undefined;

    async function enroll() {
      try {
        const token = await requestNotificationToken();
        if (!token) return;
        enrolled.current = true;
        await registerDeviceToken({ token, platform: "web" });
        unsubscribe = await onForegroundNotification((payload) => {
          const title = payload.notification?.title ?? payload.data?.title ?? "VIVRΛNT";
          const body =
            payload.notification?.body ??
            payload.data?.body ??
            "You have a new update.";
          toast(title, { description: body });
        });
      } catch (error) {
        console.error("Push enrollment failed:", error);
      }
    }

    void enroll();
    return () => unsubscribe?.();
  }, [enabled]);

  return null;
}
