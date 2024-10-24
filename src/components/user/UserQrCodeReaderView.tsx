'use client';

import React, { useCallback } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';

import { useUserHomeStore } from '@/stores/user/userHomeSlice';
import { useQRCodeReaderStore } from '@stores/user/qrcodeReaderSlice';
import { useUserHomeFABStore } from '@stores/user/userHomeFABSlice';

import { insertAttendance } from '@actions/insertAttendance'

export function UserQrCodeReader() {
  const { isQRCodeReaderVisible, hide: hideQRCodeReader } = useQRCodeReaderStore();
  const { show: showFAB } = useUserHomeFABStore();
  const { userId } = useUserHomeStore();

  // Hooksは無条件に呼び出す
  const handleScan = useCallback(
    async (detectedCodes: IDetectedBarcode[]) => {
      const code = detectedCodes[0];
      if (!code) return;
  
      const decodedText = code.rawValue;
      if (decodedText === 'FIXED_QR_CODE_CONTENT') {
        try {
          const res = await insertAttendance(userId);
          alert(res.message);
          hideQRCodeReader();
          showFAB();
        } catch (error) {
          alert('打刻に失敗しました');
          console.error(error);
        }
      }
    },
    [hideQRCodeReader, showFAB, userId]
  );

  const handleError = useCallback((error: any) => {
    console.error('QRコードの読み取りエラー:', error);
  }, []);

  const handleClose = () => {
    hideQRCodeReader();
    showFAB();
  };

  // Hooksの呼び出し後に条件分岐を行う
  if (!isQRCodeReaderVisible) return null;

  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      {/* 閉じるボタン */}
      <IconButton
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 100 }}
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>

      {/* ヘッダーテキスト */}
      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          top: 16,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 100,
        }}
      >
        出入口にあるQRコードを読み込んでください
      </Typography>

      {/* QRコードスキャナー */}
      <Box sx={{ width: '100%', height: '100%' }}>
        <Scanner onScan={handleScan} onError={handleError} />
      </Box>

      {/* QRコードの位置を示すプレースホルダー */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.5,
          zIndex: 99,
        }}
      >
        {/* ここにカスタムUIを追加可能 */}
      </Box>
    </Box>
  );
}
