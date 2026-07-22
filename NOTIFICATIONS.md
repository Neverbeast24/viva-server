# Push notifications setup (web + mobile)

VIVRΛNT has three notification layers:

1. **In-app inbox** — bell in the dashboard / admin header (always works once signed in)
2. **Web push (FCM)** — Chrome / Edge / Firefox / Android Chrome; iOS only when installed as a Home Screen web app (iOS 16.4+)
3. **Native mobile push** — Android / iOS apps register their FCM device token via `POST /api/device-tokens`

Staff get an in-app + push alert when a member submits a support ticket. Members get an alert when staff update their ticket. Admin broadcasts also fan out as in-app + push.

---

## A. Firebase Console (one-time)

### 1. Confirm the web app

1. Open [Firebase Console](https://console.firebase.google.com/) → project **`viva-6a54d`** (or your project).
2. **Project settings → General → Your apps**
3. If no Web app exists, click **Add app → Web**, nickname `VIVRΛNT Web`, register.
4. Copy the config into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=viva-6a54d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=viva-6a54d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=viva-6a54d.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...
```

### 2. Enable Cloud Messaging + VAPID (web push)

1. Firebase → **Project settings → Cloud Messaging**
2. Under **Web Push certificates**, click **Generate key pair**
3. Copy the key into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BK...your_vapid_key...
```

### 3. Create a service account (server push)

1. Firebase → **Project settings → Service accounts**
2. Click **Generate new private key** → download the JSON
3. Put the **entire JSON on one line** in `.env.local` (keep `\n` inside `private_key`):

```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"viva-6a54d","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-...@viva-6a54d.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token"}
```

Never commit this file. Never put it in a `NEXT_PUBLIC_` variable.

### 4. App URL

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# production example:
# NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Restart `npm run dev` after changing env vars.

---

## B. Web browser setup (desktop + Android Chrome)

1. Sign in to VIVRΛNT.
2. Open **Profile → Preferences**.
3. Keep **Push notifications** checked → **Save preferences**.
4. When the browser asks “Allow notifications?”, click **Allow**.
5. Confirm a row appears in Supabase → **Table Editor → `device_tokens`** (`platform = web`).
6. Test:
   - As a member: submit a support ticket → staff accounts should get an inbox item + push
   - As staff: **Admin → System → Send notification** → member devices should buzz

### iPhone / iPad (Safari web push)

Apple only delivers web push if the site is added to the Home Screen:

1. Deploy over **HTTPS** (Vercel) — localhost web push on iOS is unreliable
2. Safari → **Share → Add to Home Screen**
3. Open VIVRΛNT from the Home Screen icon (not the Safari tab)
4. Enable Push notifications in Preferences and allow the prompt
5. Requires **iOS 16.4+**

---

## C. Native Android app (FCM)

Use this when you wrap VIVRΛNT (Capacitor / React Native / Flutter) or ship a companion app.

### 1. Register an Android app in Firebase

1. Firebase → **Add app → Android**
2. Android package name must match your app (example: `com.vivrant.app`)
3. Download **`google-services.json`** into the Android project (`app/`)
4. Follow Firebase’s Android setup for your stack (Gradle plugin, etc.)

### 2. Get an FCM token in the app

After the user signs in with **Supabase Auth**, request notification permission and read the FCM token (Firebase Messaging SDK).

### 3. Register the token with VIVRΛNT

```http
POST https://YOUR-APP.vercel.app/api/device-tokens
Authorization: Bearer <supabase_access_token>
Content-Type: application/json

{
  "token": "<fcm_device_token>",
  "platform": "android"
}
```

On logout / token refresh:

```http
DELETE https://YOUR-APP.vercel.app/api/device-tokens
Authorization: Bearer <supabase_access_token>
Content-Type: application/json

{ "token": "<old_or_current_fcm_token>" }
```

Then `POST` again with the new token.

### 4. Handle notification taps

Payload `data.href` is an in-app path such as `/admin/tickets` or `/dashboard/support`. Open that route inside your WebView / React Navigation stack.

---

## D. Native iOS app (APNs + FCM)

### 1. Apple Developer

1. Create an **Apple Push Notifications** key in [developer.apple.com](https://developer.apple.com/account/resources/authkeys/list)
2. Note Key ID + Team ID; download the `.p8` file once

### 2. Firebase iOS app

1. Firebase → **Add app → iOS** with your bundle ID
2. Download **`GoogleService-Info.plist`**
3. Firebase → **Project settings → Cloud Messaging → Apple app configuration**
4. Upload the APNs auth key (`.p8`) + Key ID + Team ID

### 3. Register the token

Same API as Android, with `"platform": "ios"`:

```http
POST /api/device-tokens
Authorization: Bearer <supabase_access_token>
Content-Type: application/json

{ "token": "<fcm_token>", "platform": "ios" }
```

Request notification permission on iOS before fetching the token.

---

## E. Supabase security checklist (do in dashboard)

### Leaked password protection

1. Supabase → **Authentication → Providers → Email** (or **Attack Protection**)
2. Enable **Leaked password protection** (HaveIBeenPwned)
3. Save

This cannot be toggled from SQL; it is an Auth product setting.

### Avatars bucket listing

Already fixed in migration `20260722_notifications_href_and_avatars_fix`: the broad Storage SELECT policy that allowed listing every avatar was removed. Public avatar **URLs** still work; the Storage API can no longer list the whole bucket.

---

## F. Vercel production env

Add the same keys used locally:

| Name | Notes |
| --- | --- |
| All `NEXT_PUBLIC_FIREBASE_*` | Web SDK |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Web push |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Server FCM send |
| `SUPABASE_SECRET_KEY` | Needed so staff ticket alerts can insert inbox rows |
| `NEXT_PUBLIC_APP_URL` | Production HTTPS URL |

Redeploy after saving.

---

## G. How to verify end-to-end

| Step | Expected |
| --- | --- |
| Member enables push + allows browser | `device_tokens` row for that user |
| Member submits ticket | Staff see bell badge; phones/browsers get push titled “New support ticket” |
| Staff updates ticket status/note | Member gets inbox + push → opens `/dashboard/support` |
| Admin broadcast | Target members get inbox + push |
| User turns push off in Preferences | In-app still works; FCM stops for that user |
| Spam tickets | After 5 in one hour, submit is blocked |

---

## Troubleshooting

- **No browser prompt** — permission already denied; reset site permissions, or push env/VAPID missing
- **Inbox works, no push** — missing `FIREBASE_SERVICE_ACCOUNT_JSON`, or no `device_tokens` row
- **iOS Safari silent** — must use Home Screen PWA on HTTPS
- **401 on `/api/device-tokens`** — send a valid Supabase access token in `Authorization: Bearer …`
- **Staff never notified** — confirm staff profiles have `role` in (`admin`,`super_admin`) and `status = active`; confirm `SUPABASE_SECRET_KEY` is set
