"use client";

import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from "firebase/messaging";
import { getFirebaseApp } from "@/lib/firebase/client";

async function messaging() {
  const app = getFirebaseApp();
  if (!app || !(await isSupported())) return null;
  return getMessaging(app);
}

async function ensureMessagingServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/api/firebase-messaging-sw");
}

export async function requestNotificationToken() {
  const instance = await messaging();
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!instance || !vapidKey || Notification.permission === "denied") {
    return null;
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();

  if (permission !== "granted") return null;

  const registration = await ensureMessagingServiceWorker();
  return getToken(instance, {
    vapidKey,
    serviceWorkerRegistration: registration ?? undefined,
  });
}

export async function onForegroundNotification(
  callback: (payload: MessagePayload) => void,
) {
  const instance = await messaging();
  return instance ? onMessage(instance, callback) : () => undefined;
}
