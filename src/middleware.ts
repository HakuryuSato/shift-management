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
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // 保護されたページ
  const protectedPaths = ["/dev/user", "/dev/admin_kanrisha"];

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      // 要求されたページに応じてloginページを返す(クエリパラメータにadminまたはuserを設定)
      const role = pathname.startsWith("/dev/admin_kanrisha")
        ? "admin"
        : "user";
      return NextResponse.redirect(
        new URL(`/login?role=${role}`, req.url)
      );
    } else {
      if (
        (pathname.startsWith("/dev/admin_kanrisha") &&
          token.user?.role !== "admin") ||
        (pathname.startsWith("/dev/user") && token.user?.role !== "user")
      ) {
        const role = pathname.startsWith("/dev/admin_kanrisha")
          ? "admin"
          : "user";
        return NextResponse.redirect(
          new URL(`/login?role=${role}`, req.url)
        );
      }
    }
  }

  return NextResponse.next();
}

// 未認証の場合にアクセスを制限するページ
export const config = {
  matcher: ["/dev/user/:path*", "/dev/admin_kanrisha/:path*"],
};
