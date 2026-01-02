import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { systemLog } from "@/lib/logger";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email: email as string },
        });

        // 🟡 LOG FAILED ATTEMPT (User not found)
        if (!user) {
          void systemLog("WARN", `Login failed: Email not found (${email})`);
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.passwordHash
        );

        if (passwordsMatch) {
          // 🔵 LOG SUCCESSFUL LOGIN
          void systemLog(
            "INFO",
            `User logged in: ${user.username} (${user.role})`
          );

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.username,
          };
        }

        // 🟡 LOG FAILED ATTEMPT (Wrong password)
        void systemLog("WARN", `Login failed: Invalid password for ${email}`);
        return null;
      },
    }),
  ],
});
