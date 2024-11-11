import Cookies from "js-cookie";
import type InterFaceUserOptions from "@/types/InterFaceUserOptions";

// 定数
const deffault_work_start_time: string = "08:30";
const deffault_work_end_time: string = "18:00";

// クッキー
const COOKIE_USER_OPTIONS = process.env.NEXT_PUBLIC_COOKIE_USER_OPTIONS as string;


// クッキーからユーザーオプションを取得
export const getUserOptions = (): InterFaceUserOptions => {
  const savedOptions = Cookies.get(COOKIE_USER_OPTIONS);
  if (savedOptions) {
    try {
      return JSON.parse(savedOptions);
    } catch (error) {
      console.error("Error parsing userOptions cookie:", error);
      return { start_time: deffault_work_start_time, end_time: deffault_work_end_time };
    }
  }
  return { start_time: deffault_work_start_time, end_time: deffault_work_end_time };
};

// ユーザーオプションをクッキーに保存
export const setUserOptions = (options: InterFaceUserOptions) => {
  Cookies.set(COOKIE_USER_OPTIONS, JSON.stringify(options), { expires: 3650 });
  // console.log("User options updated:", options);
};

// オプションが変更されたかチェック
export const hasOptionsChanged = (
  currentOptions: InterFaceUserOptions,
  newStartTime: string,
  newEndTime: string,
) => {
  return (
    currentOptions.start_time !== newStartTime ||
    currentOptions.end_time !== newEndTime
  );
};

// メイン処理
export const updateOptionsIfNeeded = (startTime: string, endTime: string) => {
  const currentOptions = getUserOptions();
  console.log("Current options from cookie:", currentOptions);
  console.log("New options to be set:", {
    start_time: startTime,
    end_time: endTime,
  });

  if (hasOptionsChanged(currentOptions, startTime, endTime)) {
    setUserOptions({ start_time: startTime, end_time: endTime });
  } else {
    console.log("User options not changed.");
  }
};
