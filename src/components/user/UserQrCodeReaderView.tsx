"use client";

// ライブラリ
import React, { useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QrCodeIcon from "@mui/icons-material/QrCode2";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

// 状態管理
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useUserQrCodeReaderViewStore } from "@/stores/user/userQrCodeReaderViewSlice";
import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useUserSnackBarStore } from "@/stores/user/userHomeSnackBarSlice";

// サーバーアクション
import { insertAttendance } from "@actions/insertAttendance";

export function UserQrCodeReader() {
  const { isQRCodeReaderVisible, hideQRCodeReader } = useUserQrCodeReaderViewStore();
  const { showUserHomeFAB } = useUserHomeFABStore();
  const { userId } = useUserHomeStore();
  const { showUserSnackBar } = useUserSnackBarStore();

  // 閉じる
  const handleClose = () => {
    hideQRCodeReader();
    showUserHomeFAB();
  };

  const handleError = (error: any) => {
    console.error("QRコードの読み取りエラー:", error);
  };

  // QRコード認識時
  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    console.log("handleScan");
    const code = detectedCodes[0];
    if (!code) return;

    const decodedText = code.rawValue;
    if (decodedText === "ATTENDANCE_QR") {
      try {
        const res = await insertAttendance(userId);
        handleClose();

        showUserSnackBar(res.message,"success");

      } catch (error) {
        console.error(error);
        handleClose();
      }
    }
  };

  // Hooksの呼び出し後に条件分岐を行う
  if (!isQRCodeReaderVisible) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 閉じる */}
      <IconButton
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          color: "white",
        }}
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>

      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: "10%",
          width: "100%",
          textAlign: "center",
          color: "#fff",
          zIndex: 10,
        }}
      >
        出退勤用QRコードを読み込んでください
      </Typography>

      {/* 背景 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* QRアイコン */}
        <Box
          sx={{
            position: "relative",
            transform: "translateY(-50px)", // 位置を上に移動
            width: "250px",
            height: "250px",
            border: "2px solid white",
            borderRadius: "4px",
            zIndex: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.7,
          }}
        >
          <QrCodeIcon sx={{ fontSize: 120, opacity: 0.5, color: "white" }} />
        </Box>
      </Box>

      <Scanner
        onScan={handleScan}
        onError={handleError}
        components={{ finder: false }}
        styles={{
          container: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          },
          video: {
            objectFit: "cover",
          },
        }}
      />
    </Box>
  );
}
