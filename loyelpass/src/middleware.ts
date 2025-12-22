// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 1. Define Protected Routes
  const isOnDashboard = [
    "/admin",
    "/business",
    "/waiter",
    "/client",
    "/dashboard-router",
  ].some((path) => pathname.startsWith(path));

  const isAuthPage = pathname.startsWith("/login");

  // 2. Logic for Dashboard Access (Strictly Protected)
  if (isOnDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  // 3. Logic for Login Page (Redirect if already logged in)
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard-router", req.nextUrl));
  }

  // 4. Root "/" is now public.
  // We do NOT redirect logged-in users away from "/" automatically,
  // so they can still see the landing page if they want.

  return NextResponse.next();
});

export const config = {
  // Matcher: Protects everything except static files and APIs
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
