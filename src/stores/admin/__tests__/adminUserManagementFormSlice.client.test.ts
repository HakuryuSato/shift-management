import { act } from 'react';
import { useAdminUserManagementFormStore } from '../adminUserManagementFormSlice';

describe('useAdminUserManagementFormStoreのテスト', () => {
  beforeEach(() => {
    // 各テストの前にZustandストアの状態をリセット
    act(() => {
      useAdminUserManagementFormStore.setState({
        isAdminUserManagementFormVisible: false,
        mode: 'register',
        userName: '',
        employmentType: 'full_time',
      });
    });
  });

  it('フォームを開き、モードを正しく設定できること', () => {
    act(() => {
      useAdminUserManagementFormStore.getState().openAdminUserManagementForm('register');
    });

    const state = useAdminUserManagementFormStore.getState();
    expect(state.isAdminUserManagementFormVisible).toBe(true);
    expect(state.mode).toBe('register');
  });

  it('フォームを閉じ、関連するフィールドがリセットされること', () => {
    act(() => {
      useAdminUserManagementFormStore.getState().closeAdminUserManagementForm();
    });

    const state = useAdminUserManagementFormStore.getState();
    expect(state.isAdminUserManagementFormVisible).toBe(false);
    expect(state.userName).toBe('');
    expect(state.employmentType).toBe('full_time');
  });

  it('ユーザー名を正しく設定できること', () => {
    act(() => {
      useAdminUserManagementFormStore.getState().setUserName('山田太郎');
    });

    const state = useAdminUserManagementFormStore.getState();
    expect(state.userName).toBe('山田太郎');
  });

  it('雇用形態を正しく設定できること', () => {
    act(() => {
      useAdminUserManagementFormStore.getState().setEmploymentType('part_time');
    });

    const state = useAdminUserManagementFormStore.getState();
    expect(state.employmentType).toBe('part_time');
  });
});
