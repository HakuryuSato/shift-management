"use client";
// 基盤
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


// 独自
import AdminLoginForm from "@components/forms/AdminLoginForm";
import TimeGridCalendar from "@forms/TimeGridCalendar"


export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => { // ページ表示時にログイン状態かクッキーを確認
      const loggedIn = Cookies.get("loggedIn");
      setIsLoggedIn(!!loggedIn);
    }, []);
  
    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
    };
  
    const handleLogout = () => { // デバッグ用 ログアウト
      Cookies.remove("loggedIn");
      Cookies.remove("adminInfo");
      setIsLoggedIn(false);
    };
  
    return (
      <>
        {isLoggedIn // ログイン済みならカレンダー、まだならログインフォーム
          ? <TimeGridCalendar onLogout={handleLogout} />
          : <AdminLoginForm onLoginSuccess={handleLoginSuccess} />}
      </>
    );
  }
  