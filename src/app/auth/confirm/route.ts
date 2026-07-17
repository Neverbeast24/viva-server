import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function loginRedirect(request: NextRequest, message: string) {
  const destination = request.nextUrl.clone();
  destination.pathname = "/login";
  destination.search = `?error=${encodeURIComponent(message)}`;
  return NextResponse.redirect(destination);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const next = params.get("next") ?? "/dashboard";

  // The provider can bounce back with an explicit error (e.g. user cancelled).
  const providerError = params.get("error_description") ?? params.get("error");
  if (providerError) {
    return loginRedirect(request, providerError);
  }

  if (!code) {
    return loginRedirect(request, "The sign-in link is missing its code.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return loginRedirect(
      request,
      "We could not complete sign in. Please try again.",
    );
  }

  const destination = request.nextUrl.clone();
  destination.pathname = next.startsWith("/") ? next : "/dashboard";
  destination.search = "";
  return NextResponse.redirect(destination);
}
