// ライブラリ
import { useState } from 'react';

// Store
import { useAdminUserManagementFormStore } from '@/stores/admin/adminUserManagementFormSlice';

// Utils
import { insertUser, deleteUser } from '@/utils/client/serverActionClient';

// Hooks
import { useAdminHomeUsersData } from '@/hooks/admin/useAdminHomeUsersData';

export function useAdminUserManagementForm() {
  const isAdminUserManagementFormVisible = useAdminUserManagementFormStore(
    (state) => state.isVisibleAdminUserManagementForm
  );
  const adminUserManagementFormMode = useAdminUserManagementFormStore(
    (state) => state.adminUserManagementFormMode
  );
  const closeAdminUserManagementForm = useAdminUserManagementFormStore(
    (state) => state.closeAdminUserManagementForm
  );

  // ユーザー登録削除後の更新用
  const { mutateUsers } = useAdminHomeUsersData();

  const [userName, setUserName] = useState('');
  const [employmentType, setEmploymentType] = useState<'full_time' | 'part_time'>('full_time');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [userNameHelperText, setUserNameHelperText] = useState('');


  const handleClose = () => {
    closeAdminUserManagementForm();
    // 状態をリセット
    setUserName('');
    setEmploymentType('full_time');
    setUserNameError(false);
    setUserNameHelperText('');
  };

  const handleActionClick = async () => {
    let isValid = true;

    // バリデーション
    if (userName.trim() === '') {
      setUserNameError(true);
      setUserNameHelperText('ユーザー名を入力してください');
      isValid = false;
    } else {
      setUserNameError(false);
      setUserNameHelperText('');
    }

    if (!isValid) {
      return;
    }

    if (adminUserManagementFormMode === 'register') {
      await insertUser({
        user_name: userName,
        employment_type: employmentType,
      });
      mutateUsers();
      handleClose();
    } else if (adminUserManagementFormMode === 'delete') {
      setIsConfirmDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    await deleteUser(userName);
    setIsConfirmDeleteOpen(false);
    mutateUsers();
    handleClose();
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteOpen(false);
  };

  return {
    isAdminUserManagementFormVisible,
    adminUserManagementFormMode,
    userName,
    setUserName,
    employmentType,
    setEmploymentType,
    isConfirmDeleteOpen,
    userNameError,
    userNameHelperText,
    handleClose,
    handleActionClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
