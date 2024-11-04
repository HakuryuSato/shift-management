import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    // カスタムプロバイダー
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;
        if (password === process.env.NEXT_PUBLIC_SITE_PASS) {
          // ユーザー認証ロジック
          const user = await getUserFromDB(username);
          if (user) {
            return { id: user.id, name: user.name, employmentType: user.employmentType, role: 'user' };
          }
        } else if (password === process.env.ADMIN_PASS) {
          // 管理者認証
          return { id: 'admin', role: 'admin' };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 50 * 365 * 24 * 60 * 60, // 50年
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
