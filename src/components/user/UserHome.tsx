"use client";

//ライブラリ
import React, { useEffect } from "react";

// コンポーネント
import { UserQrCodeReader } from "./UserQrCodeReaderView";
import { UserHomeFAB } from "./UserHomeFAB";
import { UserHomeSnackBar } from "./UserHomeSnackBar";
import { UserCalendarView } from "./UserCalendarView";
import { UserHomeAppBar } from "./UserHomeAppBar";
import { useUserHomeStore } from '@/stores/user/userHomeSlice';

// Hooks
import { useUserSessionForUserHome } from "@/hooks/useUserSessionForUserHome";

export function UserHome() {
  useUserSessionForUserHome();
  const { userId, userName, employmentType, role } = useUserHomeStore();

  // デバッグ用のログ出力
  // console.log("User Info:", { userId, userName, employmentType, role });



  return (
    <>
      <UserQrCodeReader />
      <UserHomeAppBar />
      <UserCalendarView />
      <UserHomeSnackBar />
      <UserHomeFAB />
    </>
  );
}
