import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { PrismaClient, User } from "@/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function getUser(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

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
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user || !user.password) return null;

          const valid = await bcrypt.compare(password, user.password);
          if (valid) return user;
        }
        return null;
      },
    }),
  ],
});
