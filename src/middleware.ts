import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

interface CustomToken extends JWT {
  user?: {
    role?: "user" | "admin";
  };
}

export async function middleware(req: NextRequest) {
  const token = (await getToken({ req })) as CustomToken;
  const { pathname } = req.nextUrl; // アクセス要求されたURL

  // 誰でもアクセス可能なページ
  if (pathname === "/login" || pathname === "/admin_login") {
    return NextResponse.next();
  }

  // 保護されたページ
  const protectedPaths = ["/user", "/admin_kanrisha"];

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      // 要求されたページに応じて適切なログインページにリダイレクト
      return NextResponse.redirect(
        new URL(
          pathname.startsWith("/admin_kanrisha") ? "/admin_login" : "/login",
          req.url
        )
      );
    } else {
      if (
        (pathname.startsWith("/admin_kanrisha") &&
          token.user?.role !== "admin") ||
        (pathname.startsWith("/user") && token.user?.role !== "user")
      ) {
        return NextResponse.redirect(
          new URL(
            pathname.startsWith("/admin_kanrisha") ? "/admin_login" : "/login",
            req.url
          )
        );
      }
    }
  }

  return NextResponse.next();
}

// 未認証の場合にアクセスを制限するページ
export const config = {
  matcher: ["/user/:path*", "/admin_kanrisha/:path*"],
};
