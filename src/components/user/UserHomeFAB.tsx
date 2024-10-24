import React from 'react';
import { Fab } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddIcon from '@mui/icons-material/Add';
import { useUserHomeFABStore } from '@stores/user/userHomeFABSlice';
import { useQRCodeReaderStore } from '@stores/user/qrcodeReaderSlice';

export function UserHomeFAB() {
  const { isVisible, iconType, hide } = useUserHomeFABStore();
  const { show: showQRCodeReader } = useQRCodeReaderStore();

  if (!isVisible) return null;

  const handleClick = () => {
    if (iconType === 'qr') {
      showQRCodeReader();
      hide();
    } else if (iconType === 'plus') {
      // 他のアクションをここに追加
    }
  };

  return (
    <Fab
      color="primary"
      onClick={handleClick}
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
    >
      {iconType === 'qr' ? <QrCodeIcon /> : <AddIcon />}
    </Fab>
  );
}
