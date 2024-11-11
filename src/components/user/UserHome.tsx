"use client";

//ライブラリ
import React, { useEffect } from "react";

// コンポーネント
import { UserQrCodeReader } from "./UserQrCodeReaderView";
import { UserHomeFAB } from "./UserHomeFAB";
import { UserHomeSnackBar } from "./UserHomeSnackBar";
import { UserCalendarView } from "./UserCalendarView";
import { UserHomeAppBar } from "./UserHomeAppBar";
import { ModalContainer } from "@/components/common/Modal/ModalContainer";

// Hooks
import { useCommonHomeInitialize } from "@/hooks/user/useCommonHomeInitialize";

export function UserHome() {
  // User用に各種コンポーンネントの状態を設定
  useCommonHomeInitialize("user");

  return (
    <>
      <ModalContainer/>
      <UserQrCodeReader />
      <UserHomeAppBar />
      <UserCalendarView />
      <UserHomeSnackBar />
      <UserHomeFAB />
    </>
  );
}
