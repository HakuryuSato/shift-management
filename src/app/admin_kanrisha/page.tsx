"use client";
// 基盤
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// 独自
// import AdminSelectPage from "@forms/AdminSelectPage";
import AdminShiftTable from "@forms/AdminShiftTable"
import AdminLoginForm from "@components/forms/AdminLoginForm";
import TimeGridCalendar from "@forms/TimeGridCalendar";

const COOKIE_ADMIN_ISLOGGEDIN = process.env.NEXT_PUBLIC_COOKIE_ADMIN_ISLOGGEDIN as string


export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("AdminSelectPage");

  // フック
  useEffect(() => { // ページ表示時にログイン状態かクッキーを確認
    const loggedIn = Cookies.get(COOKIE_ADMIN_ISLOGGEDIN);
    setIsLoggedIn(!!loggedIn);
  }, []);

  // ハンドラ
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => { // デバッグ用 ログアウト
    Cookies.remove(COOKIE_ADMIN_ISLOGGEDIN);
    setIsLoggedIn(false);
  };

  const handleBackButtonClick = (page: string) => {
    if (page === "Logout") {
      handleLogout();
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {isLoggedIn
        ? (
          currentPage === "AdminShiftTable"
            ? (
              <AdminShiftTable
              onButtonClickBackToShiftApproval={() => handleBackButtonClick("TimeGridCalendar")}
              />
            )
            : (
              <TimeGridCalendar
                onLogout={handleLogout}
                onBack={() => handleBackButtonClick("AdminShiftTable")}
              />
            )
        )
        : <AdminLoginForm onLoginSuccess={handleLoginSuccess} />}
    </>
  );
}
