import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/common/LoginForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import '@testing-library/jest-dom'; // 追加

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (signIn as jest.Mock).mockResolvedValue({ ok: true });
  });

  it("ユーザーログインフォームが表示される", () => {
    render(<LoginForm role="user" />);
    expect(screen.getByText("ユーザーログイン")).toBeInTheDocument();
  });

  it("管理者ログインフォームが表示される", () => {
    render(<LoginForm role="admin" />);
    expect(screen.getByText("管理者ログイン")).toBeInTheDocument();
  });

  it("ログインが成功する場合の処理を行う", async () => {
    render(<LoginForm role="user" />);
    fireEvent.change(screen.getByLabelText("お名前"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText("サイトパスワード"), { target: { value: "password" } });
    fireEvent.click(screen.getByText("ログイン"));

    expect(signIn).toHaveBeenCalledWith("credentials", expect.any(Object));
    await screen.findByText("ログイン");
    expect(mockRouterPush).toHaveBeenCalledWith("/dev/user");
  });

  it("ログインが失敗した場合にエラーメッセージを表示する", async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: false, error: "Error" });
    render(<LoginForm role="user" />);
    fireEvent.click(screen.getByText("ログイン"));

    expect(await screen.findByText("ログインに失敗しました。入力内容を確認してください。")).toBeInTheDocument();
  });
});
