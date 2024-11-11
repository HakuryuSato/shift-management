import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AdminUserManagementForm } from "../AttendanceView/AdminUserManagementForm";
import { useAdminUserManagementFormStore } from "@/stores/admin/adminUserManagementFormSlice";
import { act } from "react";

// モック関数
jest.mock("@/utils/client/serverActionClient", () => ({
  insertUserAction: jest.fn(),
  deleteUserAction: jest.fn(),
}));

const { insertUserAction, deleteUserAction } = require(
  "@/utils/client/serverActionClient",
);

describe("AdminUserManagementForm コンポーネントのテスト", () => {
  beforeEach(() => {
    useAdminUserManagementFormStore.setState({
      isAdminUserManagementFormVisible: false,
      mode: "register",
      userName: "",
      employmentType: "full_time",
      openAdminUserManagementForm: jest.fn(),
      closeAdminUserManagementForm: jest.fn(),
      setUserName: jest.fn(),
      setEmploymentType: jest.fn(),
    });
  });

  it("フォームが非表示の時にレンダリングされないこと", () => {
    render(<AdminUserManagementForm />);
    expect(screen.queryByText("ユーザー登録")).not.toBeInTheDocument();
  });

  it("登録モードでフォームが表示されること", () => {
    useAdminUserManagementFormStore.setState({
      isAdminUserManagementFormVisible: true,
      mode: "register",
    });

    render(<AdminUserManagementForm />);
    expect(screen.getByText("ユーザー登録")).toBeInTheDocument();
  });

  it("削除モードでフォームが表示されること", () => {
    useAdminUserManagementFormStore.setState({
      isAdminUserManagementFormVisible: true,
      mode: "delete",
    });

    render(<AdminUserManagementForm />);
    expect(screen.getByText("ユーザー削除")).toBeInTheDocument();
  });

  it("ユーザー名のバリデーションエラーを表示すること", () => {
    useAdminUserManagementFormStore.setState({
      isAdminUserManagementFormVisible: true,
      mode: "register",
    });

    render(<AdminUserManagementForm />);
    fireEvent.click(screen.getByText("登録"));
    expect(screen.getByText("ユーザー名を入力してください"))
      .toBeInTheDocument();
  });

  it("ユーザー名を入力して登録が成功すること", async () => {
    useAdminUserManagementFormStore.setState({
      isAdminUserManagementFormVisible: true,
      mode: "register",
      setUserName: (name: string) =>
        useAdminUserManagementFormStore.setState({ userName: name }),
    });

    render(<AdminUserManagementForm />);
    fireEvent.change(screen.getByLabelText("ユーザー名"), {
      target: { value: "テストユーザー" },
    });
    fireEvent.click(screen.getByText("登録"));

    await waitFor(() => {
      expect(insertUserAction).toHaveBeenCalledWith({
        user_name: "テストユーザー",
        employment_type: "full_time",
      });
    });
  });

  it("削除モードで削除確認モーダルが表示されること", async () => {
    useAdminUserManagementFormStore.setState({
      isAdminUserManagementFormVisible: true,
      mode: "delete",
      userName: "削除対象ユーザー",
    });

    render(<AdminUserManagementForm />);
    fireEvent.click(screen.getByText("削除", { selector: "button" }));

    expect(screen.getByText(/削除しますがよろしいですか？/))
      .toBeInTheDocument();
  });

  it("削除確認後に削除アクションが呼ばれること", async () => {
    useAdminUserManagementFormStore.setState({
      isAdminUserManagementFormVisible: true,
      mode: "delete",
      userName: "削除対象ユーザー",
    });

    render(<AdminUserManagementForm />);

    await act(async () => {
      fireEvent.click(screen.getByText("削除", { selector: "button" }));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "削除" }));
    });

    await waitFor(() => {
      expect(deleteUserAction).toHaveBeenCalledWith("削除対象ユーザー");
    });
  });
});
