/* Placeholder service worker.
 * Prefer /api/firebase-messaging-sw.js, which injects your Firebase web config.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
