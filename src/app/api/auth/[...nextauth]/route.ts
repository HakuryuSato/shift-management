import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User as CustomUserType } from "@/customTypes/User";
import { JWT } from "next-auth/jwt";

interface CustomUser extends NextAuthUser, CustomUserType {
  role?: "user" | "admin";
  user_id?: number;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        input1: { label: "Input1", type: "text" },
        input2: { label: "Input2", type: "password" },
        role: { label: "Role", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { input1, input2, role } = credentials;

        if (role === "user") {
          // サイトパスワードの検証
          if (input2 !== process.env.SITE_PASSWORD) {
            return null;
          }

          // ユーザーの取得
          const apiResponse = await fetch(
            `${process.env.NEXTAUTH_URL}/api/users/${input1}`
          );

          if (!apiResponse.ok) return null;

          const user = (await apiResponse.json()) as CustomUserType;

          if (user) {
            return {
              id: user.user_id?.toString() || "user_default_id",
              name: user.user_name || "Default User",
              email: "user@example.com",
              role: "user",
              user_id: user.user_id,
            } as CustomUser;
          }
        } else if (role === "admin") {
          // サイトパスワードと管理者パスワードの検証
          if (
            input1 === process.env.SITE_PASSWORD &&
            input2 === process.env.ADMIN_PASSWORD
          ) {
            return {
              id: "admin",
              name: "Admin",
              email: "admin@example.com",
              role: "admin",
            } as CustomUser;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: CustomUser | null }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.user) {
        session.user = token.user as CustomUser;
      }
      return session;
    },
    // authでエラーがあった場合などに戻す
    async redirect({ url, baseUrl, error }: { url: string; baseUrl: string; error?: string }) {
      if (error) {
        const role = error.includes('user') ? 'user' : 'admin'; // エラー内容に応じてroleを決定
        return `${baseUrl}/login?role=${role}`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 50 * 365 * 24 * 60 * 60,
  },
  pages: { // authでエラーがあった場合などに戻す
    signIn: '/login',
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
