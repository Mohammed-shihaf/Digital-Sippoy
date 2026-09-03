import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const expectedUsername = process.env.DEMO_USERNAME ?? "admin";
        const expectedPassword = process.env.DEMO_PASSWORD ?? "changeme";
        if (
          credentials?.username === expectedUsername &&
          credentials?.password === expectedPassword
        ) {
          return { id: "1", name: expectedUsername };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "insecure-default-secret-for-fixture",
  pages: { signIn: "/login" },
};

export default NextAuth(authOptions);
