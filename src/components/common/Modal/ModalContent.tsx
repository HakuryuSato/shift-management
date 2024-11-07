import React from 'react';
import { Typography } from '@mui/material';
import { useModalStore } from '@/stores/common/modalSlice';
import TimeDropdown from '@/components/common/TimeDropdown';
import UserDropdown from './UserDropdown';

const ModalContent: React.FC = () => {
  const { modalRole, modalAction } = useModalStore();

  return (
    <div>
      {modalRole === 'admin' && <Typography>ユーザー名</Typography>}
      {modalRole === 'admin' ? <UserDropdown /> : <Typography>固定ユーザー名</Typography>}
      {modalAction == 'register' && (
        <TimeDropdown label="開始時間" disabled={false} onChange={() => {}} />
      )}
    </div>
  );
};

export default ModalContent;
