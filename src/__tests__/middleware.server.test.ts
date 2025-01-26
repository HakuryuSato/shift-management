// src/__tests__/middleware.server.test.ts
import { NextResponse } from "next/server";
import { middleware } from "../middleware";
import { getToken } from "next-auth/jwt";

jest.mock("next-auth/jwt");

describe("middleware", () => {
  const mockGetToken = getToken as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ログインページへのアクセスを許可する", async () => {
    const url = new URL("https://localhost/login");
    const req = { nextUrl: url, url: url.toString(), headers: new Headers() } as any;
    const response = await middleware(req);
    expect(response).toEqual(NextResponse.next());
  });

  it("未認証のユーザーが管理者ページにアクセスしようとした場合、ログインページにリダイレクトする", async () => {
    const requestUrl = "https://localhost/admin_kanrisha";
    const url = new URL(requestUrl);
    const req = { nextUrl: url, url: requestUrl } as any;
    mockGetToken.mockResolvedValue(null);
    const response = await middleware(req);
    
    const expectedUrl = new URL("/login?role=admin", requestUrl);
    expect(response.headers.get("Location")).toBe(expectedUrl.toString());
    expect(response.status).toBe(307); // デフォルトのリダイレクトステータス
  });

  it("未認証のユーザーがユーザーページにアクセスしようとした場合、ログインページにリダイレクトする", async () => {
    const requestUrl = "https://localhost/dev/user";
    const url = new URL(requestUrl);
    const req = { nextUrl: url, url: requestUrl, headers: new Headers() } as any;
    mockGetToken.mockResolvedValue(null);
    const response = await middleware(req);
    
    const expectedUrl = new URL("/login?role=user", requestUrl);
    expect(response.headers.get("Location")).toBe(expectedUrl.toString());
    expect(response.status).toBe(307);
  });

  it("管理者ユーザーが管理者ページにアクセスできる", async () => {
    const requestUrl = "https://localhost/admin_kanrisha";
    const url = new URL(requestUrl);
    const req = { nextUrl: url, url: requestUrl, headers: new Headers() } as any;
    mockGetToken.mockResolvedValue({ user: { role: "admin" } });
    const response = await middleware(req);
    expect(response).toEqual(NextResponse.next());
  });

  it("非管理者ユーザーが管理者ページにアクセスしようとした場合、ログインページにリダイレクトする", async () => {
    const requestUrl = "https://localhost/admin_kanrisha";
    const url = new URL(requestUrl);
    const req = { nextUrl: url, url: requestUrl, headers: new Headers() } as any;
    mockGetToken.mockResolvedValue({ user: { role: "user" } });
    const response = await middleware(req);
    
    const expectedUrl = new URL("/login?role=admin", requestUrl);
    expect(response.headers.get("Location")).toBe(expectedUrl.toString());
    expect(response.status).toBe(307);
  });

  it("ユーザーがユーザーページにアクセスできる", async () => {
    const requestUrl = "https://localhost/dev/user";
    const url = new URL(requestUrl);
    const req = { nextUrl: url, url: requestUrl, headers: new Headers() } as any;
    mockGetToken.mockResolvedValue({ user: { role: "user" } });
    const response = await middleware(req);
    expect(response).toEqual(NextResponse.next());
  });

  it("非ユーザーがユーザーページにアクセスしようとした場合、ログインページにリダイレクトする", async () => {
    const requestUrl = "https://localhost/dev/user";
    const url = new URL(requestUrl);
    const req = { nextUrl: url, url: requestUrl, headers: new Headers() } as any;
    mockGetToken.mockResolvedValue({ user: { role: "admin" } });
    const response = await middleware(req);
    
    const expectedUrl = new URL("/login?role=user", requestUrl);
    expect(response.headers.get("Location")).toBe(expectedUrl.toString());
    expect(response.status).toBe(307);
  });
});
