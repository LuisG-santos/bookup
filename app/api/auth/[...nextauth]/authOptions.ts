import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { db } from "@/app/_lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.id) {
        // se o TS reclamar, é falta de module augmentation
        (session.user as any).id = token.id;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) token.id = (user as any).id;
      return token;
    },

    async redirect({ url, baseUrl }) {
      const normalize = (s: string) => s.replace("://www.", "://");

      const base = normalize(baseUrl);

      if (url.startsWith("/")) return `${base}${url}`;

      try {
        const u = new URL(normalize(url));

        const host = u.hostname.toLowerCase();
        const isBelivio =
          host === "belivio.com.br" || host.endsWith(".belivio.com.br");

        if (isBelivio) return u.toString();
      } catch { }

      return base;
    }
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".belivio.com.br" : undefined,
      },
    },

    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.callback-url"
          : "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".belivio.com.br" : undefined,
      },
    },

    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages:{
    signIn: '/login',
    error: '/login',
  }
};