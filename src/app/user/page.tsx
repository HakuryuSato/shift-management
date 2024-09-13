"use client";

// 基盤
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


// 独自
import DayGridCalendar from "@forms/DayGridCalendar";
import UserLoginForm from "@components/forms/UserLoginForm";

// 型
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";

// クッキー名称
const COOKIE_USER_LOGGED_IN = process.env
  .NEXT_PUBLIC_COOKIE_USER_LOGGEDIN as string;
const COOKIE_USER_INFO = process.env.NEXT_PUBLIC_COOKIE_USER_INFO as string;
const COOKIE_USER_OPTIONS = process.env
  .NEXT_PUBLIC_COOKIE_USER_OPTIONS as string;

export default function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<InterFaceTableUsers>({
    user_id: 0,
    user_name: "",
  });

  useEffect(() => { // ページ表示時にログイン状態とクッキーを確認
    const loggedIn = Cookies.get(COOKIE_USER_LOGGED_IN);
    const userInfo = Cookies.get(COOKIE_USER_INFO);

    setIsLoggedIn(!!loggedIn);
    if (userInfo) { // クッキーにユーザー情報があるなら
      setUser(JSON.parse(userInfo)); // クッキーからユーザー情報を取得
    }
  }, []);

  const handleLoginSuccess = (userData: InterFaceTableUsers) => { // ログイン成功時にユーザー情報をクッキーに保存
    setIsLoggedIn(true);
    setUser(userData);
  };

  return (
    <>
      {isLoggedIn // ログイン済みならカレンダー、まだならログインフォーム
        ? <DayGridCalendar user={user} />
        : <UserLoginForm onLoginSuccess={handleLoginSuccess} />}
    </>
  );
}
