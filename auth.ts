import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { PrismaClient, Prisma, User } from "@/generated/prisma";
import bcrypt from "bcrypt";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};

const prisma = new PrismaClient();

type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: { include: { role: true } } };
}>;

async function getUser(username: string): Promise<UserWithRoles | null> {
  try {
    return await prisma.user.findUnique({
      where: { username },
      include: { roles: { include: { role: true } } },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

const credentialsSchema = z.object({
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(30, "El usuario no puede tener más de 30 caracteres.")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Solo letras, números, guiones, puntos y _")
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(128, "La contraseña es demasiado larga.")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula.")
    .regex(/[a-z]/, "Debe contener al menos una minúscula.")
    .regex(/[0-9]/, "Debe contener al menos un número.")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo."),
});

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);
          if (!user || !user.password) return null;

          const valid = await bcrypt.compare(password, user.password);

          if (!valid) return null;
          return {
            id: String(user.id),
            username: user.username ?? "",
            name: user.name ?? "",
            roles: user.roles.map((ur) => ur.role.name.trim().toLowerCase()),
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const roles = ((user as any).roles ?? []).map((r: string) =>
          String(r).trim().toLowerCase()
        );
        token.roles = roles;
        token.uid = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).roles = (token.roles as string[]) ?? [];
      (session.user as any).id = token.uid ?? (session.user as any).id;
      return session;
    },
  },
});
