import type { NextAuthConfig } from "next-auth";
import { isAllowed } from "./auth.rules";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;

      if (!auth?.user) {
        if (pathname.startsWith("/dashboard")) return false;
        return true;
      }

      const roles = ((auth.user as any)?.roles ?? []).map((r: string) =>
        r.toLowerCase()
      );
      return isAllowed(pathname, roles);
    },
    async jwt({ token, user }) {
      if (user) {
        token.roles = ((user as any)?.roles ?? []).map((r: string) =>
          String(r).toLowerCase()
        );
        token.name = (user as any).name ?? token.name;
        token.username = (user as any).username ?? token.username;
        token.uid = (user as any).id ?? token.uid;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.name = token.name ?? session.user.name;
      (session.user as any).username =
        token.username ?? (session.user as any).username;
      (session.user as any).roles = (token.roles as string[]) ?? [];
      (session.user as any).id = token.uid ?? (session.user as any).id;
      return session;
    },
  },
  providers: [],
};
