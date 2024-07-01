"use client";
// 基盤
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// 独自
import AdminSelectPage from "@forms/AdminSelectPage";
import AdminLoginForm from "@components/forms/AdminLoginForm";
import TimeGridCalendar from "@forms/TimeGridCalendar";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("AdminSelectPage");

  // フック
  useEffect(() => { // ページ表示時にログイン状態かクッキーを確認
    const loggedIn = Cookies.get("loggedIn");
    setIsLoggedIn(!!loggedIn);
  }, []);

  // ハンドラ
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => { // デバッグ用 ログアウト
    Cookies.remove("loggedIn");
    Cookies.remove("adminInfo");
    setIsLoggedIn(false);
  };

  const handleButtonClick = (page: string) => {
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
          currentPage === "AdminSelectPage"
            ? (
              <AdminSelectPage
                onButtonClick={() => handleButtonClick("TimeGridCalendar")}
              />
            )
            : (
              <TimeGridCalendar
                onLogout={handleLogout}
                onBack={() => handleButtonClick("AdminSelectPage")}
              />
            )
        )
        : <AdminLoginForm onLoginSuccess={handleLoginSuccess} />}
    </>
  );
}
