import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales } from "../i18n";

const { auth } = NextAuth(authConfig);

const intlMiddleware = createIntlMiddleware({
  locales: locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 1. Check if the path already has a locale
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 2. Helper to get clean path
  const pathWithoutLocale = hasLocale
    ? pathname.replace(/^\/(en|fr|ar)/, "") || "/"
    : pathname;

  const currentLocale = pathname.split("/")[1] || "en";

  const isDashboardPage = [
    "/admin",
    "/business",
    "/waiter",
    "/client",
    "/dashboard-router",
  ].some((path) => pathWithoutLocale.startsWith(path));

  const isAuthPage =
    pathWithoutLocale.startsWith("/login") ||
    pathWithoutLocale.startsWith("/register");

  // 3. Logic for Dashboard Access
  if (isDashboardPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/login`, req.nextUrl)
      );
    }
  }

  // 4. Logic for Auth Pages (prevent logged in users from seeing login)
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/dashboard-router`, req.nextUrl)
    );
  }

  // 5. Let intlMiddleware handle the rest (adding locales to URLs)
  return intlMiddleware(req);
});

export const config = {
  // Matcher for all routes except static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
