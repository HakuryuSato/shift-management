import { useCallback } from "react";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";

// 状態管理
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useUserQrCodeReaderViewStore } from "@/stores/user/userQrCodeReaderViewSlice";
import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useUserSnackBarStore } from "@/stores/user/userHomeSnackBarSlice";
import { useUserCalendarViewStore } from "@/stores/user/userCalendarViewSlice";
import { useUserHomeAppBarStore } from "@/stores/user/userHomeAppBarSlice";

// サーバーアクション
import { punchAttendance } from "@/utils/client/serverActionClient";

export function useUserQrCodeReaderView() {
  const hideQRCodeReader = useUserQrCodeReaderViewStore(
    (state) => state.hideQRCodeReader
  );
  const setIsUserHomeFABVisible = useUserHomeFABStore(
    (state) => state.setIsUserHomeFABVisible
  );
  const userId = useUserHomeStore((state) => state.userId);
  const showUserSnackBar = useUserSnackBarStore(
    (state) => state.showUserSnackBar
  );
  const setIsUserCalendarViewVisible = useUserCalendarViewStore(
    (state) => state.setIsUserCalendarViewVisible
  );
  const showUserHomeAppBar = useUserHomeAppBarStore(
    (state) => state.showUserHomeAppBar
  );

  // 閉じる
  const handleClose = useCallback(() => {
    console.log(`[${new Date().toISOString()}] handleClose 開始`);
    hideQRCodeReader();
    setIsUserHomeFABVisible(true);
    setIsUserCalendarViewVisible(true);
    showUserHomeAppBar();
    console.log(`[${new Date().toISOString()}] handleClose 終了`);
  }, [
    hideQRCodeReader,
    setIsUserHomeFABVisible,
    setIsUserCalendarViewVisible,
    showUserHomeAppBar,
  ]);

  // エラー時
  const handleError = useCallback((error: any) => {
    console.error("QRコードの読み取りエラー:", error);
  }, []);

  // QRコード認識時
  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    try {
      console.log(`[${new Date().toISOString()}] handleScan 開始`);

      if (detectedCodes[0]?.rawValue === "ATTENDANCE_QR") {
        // console.log(`[${new Date().toISOString()}] handleScan punchAttendance 開始`);
        await punchAttendance(userId);
        // console.log(`[${new Date().toISOString()}] handleScan punchAttendance 終了`);
        showUserSnackBar("打刻完了しました", "success");
        handleClose();
        // console.log(`[${new Date().toISOString()}] handleScan 終了`);
      } 

    } catch (error) {
      console.error(`[${new Date().toISOString()}] handleScan エラー`, error);
      if (error instanceof Error) {
        showUserSnackBar(error.message, "error");
      } else {
        showUserSnackBar("エラーが発生しました", "error");
      }
      handleClose();
    }
  };



  return { handleClose, handleError, handleScan };
}
