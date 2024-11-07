"use client";

//ライブラリ
import React, { useEffect } from "react";

// コンポーネント
import { UserQrCodeReader } from "./UserQrCodeReaderView";
import { UserHomeFAB } from "./UserHomeFAB";
import { UserHomeSnackBar } from "./UserHomeSnackBar";
import { UserCalendarView } from "./UserCalendarView";
import { UserHomeAppBar } from "./UserHomeAppBar";

// Stores
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";

// Hooks
import { useUserHomeUserSession } from "@/hooks/user/useUserHomeUserSession";

export function UserHome() {

  // UserSessionの情報をStoreにセット
  useUserHomeUserSession();

  // 各種コンポーネントをUser用に設定
  
  

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
