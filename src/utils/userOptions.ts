import Cookies from "js-cookie";
import type { InterFaceUserOptions } from "@customTypes/InterFaceUserOptions";

// クッキーからユーザーオプションを取得
export const getUserOptions = (): InterFaceUserOptions => {
  const savedOptions = Cookies.get("userOptions");
  if (savedOptions) {
    try {
      return JSON.parse(savedOptions);
    } catch (error) {
      console.error("Error parsing userOptions cookie:", error);
      return { start_time: "", end_time: "" };
    }
  }
  return { start_time: "", end_time: "" };
};

// ユーザーオプションをクッキーに保存
export const setUserOptions = (options: InterFaceUserOptions) => {
  Cookies.set("userOptions", JSON.stringify(options), { expires: 365 });
  console.log("User options updated:", options);
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
