// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // 1. Identify where the user is trying to go
      const isOnDashboard =
        nextUrl.pathname.startsWith("/admin") ||
        nextUrl.pathname.startsWith("/business") ||
        nextUrl.pathname.startsWith("/waiter") ||
        nextUrl.pathname.startsWith("/client") ||
        nextUrl.pathname === "/dashboard-router";

      const isRoot = nextUrl.pathname === "/";
      const isAuthPage = nextUrl.pathname.startsWith("/login");

      // 2. Logic for Root Path "/"
      // If on root, always redirect. To dashboard if logged in, to login if not.
      if (isRoot) {
        if (isLoggedIn)
          return Response.redirect(new URL("/dashboard-router", nextUrl));
        return false; // Triggers redirect to /login
      }

      // 3. Logic for Dashboard Pages
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      // 4. Logic for Auth Pages (Login)
      // If already logged in and tries to visit /login, send them to dashboard
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard-router", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
