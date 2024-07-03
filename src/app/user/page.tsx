"use client";

// 基盤
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// 独自
import DayGridCalendar from "@forms/DayGridCalendar";
import UserLoginForm from "@components/forms/UserLoginForm";

// 型
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";


export default function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<InterFaceTableUsers>({
    user_id: 0,
    user_name: "",
  });

  useEffect(() => { // ページ表示時にログイン状態かクッキーを確認
    const loggedIn = Cookies.get("loggedIn");
    const userInfo = Cookies.get("userInfo");

    setIsLoggedIn(!!loggedIn);
    if (userInfo) {
      setUser(JSON.parse(userInfo)); // クッキーからユーザー情報を取得
    }
  }, []);

  const handleLoginSuccess = (userData: InterFaceTableUsers) => { // ログイン成功時にユーザー情報をクッキーに保存
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => { // デバッグ用 ログアウト
    Cookies.remove("loggedIn");
    Cookies.remove("userInfo");
    setIsLoggedIn(false);
    setUser({ user_id: 0, user_name: "" });
  };

  return (
    <>
      {isLoggedIn // ログイン済みならカレンダー、まだならログインフォーム
        ? <DayGridCalendar onLogout={handleLogout} user={user} />
        : <UserLoginForm onLoginSuccess={handleLoginSuccess} />}
    </>
  );
}
