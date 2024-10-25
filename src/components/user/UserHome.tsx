"use client";

//ライブラリ
import React, { useEffect } from "react";

// コンポーネント
import { UserQrCodeReader } from "./UserQrCodeReaderView";
import { UserHomeFAB } from "./UserHomeFAB";
import { UserHomeSnackBar } from "./UserHomeSnackBar";
import { UserCalendarView } from "./UserCalendarView";

// 状態管理
import { useUserHomeStore } from "@/stores/user/userHomeSlice";

export function UserHome() {
  const { userId, setUserId } = useUserHomeStore();

  // テスト用にここでuserIdをセットしている、最終的にはミドルウェアでセットを行う。
  const useEffectOnce = () => {
    useEffect(() => {
      setUserId(2); // userId=2
    }, []); // 空の依存配列なので、初回マウント時にのみ実行
  };

  useEffectOnce();

  return (
    <>
      <UserQrCodeReader />
      <UserHomeSnackBar />
      <UserCalendarView />
      <UserHomeFAB />
    </>
  );
}
