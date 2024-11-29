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
    hideQRCodeReader();
    setIsUserHomeFABVisible(true);
    setIsUserCalendarViewVisible(true);
    showUserHomeAppBar();
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
  const handleScan = useCallback(
    async (detectedCodes: IDetectedBarcode[]) => {
      console.log("handleScan");
      const code = detectedCodes[0];
      if (!code) return;

      const decodedText = code.rawValue;
      if (decodedText === "ATTENDANCE_QR") {
        try {
          await punchAttendance(userId);
          handleClose();
          showUserSnackBar("打刻完了しました", "success");
        } catch (error) {
          console.error(error);
          handleClose();
        }
      }
    },
    [handleClose, showUserSnackBar, userId]
  );

  return { handleClose, handleError, handleScan };
}
