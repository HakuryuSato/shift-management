// モックをトップレベルで定義
jest.mock('@/utils/server/handleSupabaseRequest', () => ({
    handleSupabaseRequest: jest.fn(),
  }));
  
  import { deleteUser } from '../deleteUser';
  import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
  import { User } from '@/customTypes/User';
  
  describe('actions/deleteUser', () => {
    const mockHandleSupabaseRequest = handleSupabaseRequest as jest.MockedFunction<typeof handleSupabaseRequest>;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('ユーザーを削除する', async () => {
      const userName = 'Test User';
      const returnedUser: User = { user_id: 1, user_name: 'Test User', employment_type: 'full_time' };
  
      // モックが返す値を設定
      mockHandleSupabaseRequest.mockResolvedValueOnce(returnedUser);
  
      const result = await deleteUser(userName);
  
      // handleSupabaseRequestが呼び出されたか確認
      expect(mockHandleSupabaseRequest).toHaveBeenCalledWith(expect.any(Function));
      // 返り値が期待通りか確認
      expect(result).toEqual(returnedUser);
    });
  
    it('エラー処理', async () => {
      const userName = 'Test User';
      const errorMessage = 'Deletion failed';
  
      // モックがエラーを投げるように設定
      mockHandleSupabaseRequest.mockRejectedValueOnce(new Error(errorMessage));
  
      await expect(deleteUser(userName)).rejects.toThrow(errorMessage);
    });
  });
  