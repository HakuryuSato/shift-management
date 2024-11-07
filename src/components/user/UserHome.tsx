"use client";

//ライブラリ
import React, { useEffect } from "react";

// コンポーネント
import { UserQrCodeReader } from "./UserQrCodeReaderView";
import { UserHomeFAB } from "./UserHomeFAB";
import { UserHomeSnackBar } from "./UserHomeSnackBar";
import { UserCalendarView } from "./UserCalendarView";
import { UserHomeAppBar } from "./UserHomeAppBar";

// Hooks
import { useUserHomeUserSession } from "@/hooks/useUserHomeUserSession";

export function UserHome() {

  // UserSessionの情報をStoreにセット
  useUserHomeUserSession();

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
