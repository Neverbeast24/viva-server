import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging, type Messaging } from "firebase-admin/messaging";

type ServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function readServiceAccount(): ServiceAccountJson | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ServiceAccountJson;
  } catch (error) {
    console.error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON:", error);
    return null;
  }
}

export function getFirebaseAdminApp(): App | null {
  if (getApps().length) return getApps()[0]!;

  const serviceAccount = readServiceAccount();
  if (
    !serviceAccount?.project_id ||
    !serviceAccount.client_email ||
    !serviceAccount.private_key
  ) {
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
}

export function getFirebaseAdminMessaging(): Messaging | null {
  const app = getFirebaseAdminApp();
  return app ? getMessaging(app) : null;
}
