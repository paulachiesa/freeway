import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isOnDashboard = pathname.startsWith("/dashboard");
      const isOnLogin = pathname.startsWith("/login");

      if (isOnDashboard && !isLoggedIn) return false;
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (isLoggedIn && !isOnDashboard && !isOnLogin) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
