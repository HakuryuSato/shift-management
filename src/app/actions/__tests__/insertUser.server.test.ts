jest.mock('@/utils/server/handleSupabaseRequest', () => ({
  handleSupabaseRequest: jest.fn(),
}));

import { insertUser } from '../insertUser';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { User } from '@/customTypes/User';

describe('actions/insertUser', () => {
  const mockHandleSupabaseRequest = handleSupabaseRequest as jest.MockedFunction<typeof handleSupabaseRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('part_timeのユーザーを挿入する', async () => {
    const mockUser: User = { user_name: 'Test User', employment_type: 'part_time' };
    const returnedUser: User = { user_id: 1, user_name: 'Test User', employment_type: 'part_time' };

    // モックが返す値を設定
    mockHandleSupabaseRequest.mockResolvedValueOnce(returnedUser);

    const result = await insertUser(mockUser);

    // handleSupabaseRequestが呼び出されたか確認
    expect(mockHandleSupabaseRequest).toHaveBeenCalledWith(expect.any(Function));
    // 返り値が期待通りか確認
    expect(result).toEqual(returnedUser);
  });

  it('full_timeのユーザーを挿入する', async () => {
    const mockUser: User = { user_name: 'Test User', employment_type: 'full_time' };
    const returnedUser: User = { user_id: 1, user_name: 'Test User', employment_type: 'full_time' };

    // モックが返す値を設定
    mockHandleSupabaseRequest.mockResolvedValueOnce(returnedUser);

    const result = await insertUser(mockUser);

    // handleSupabaseRequestが呼び出されたか確認
    expect(mockHandleSupabaseRequest).toHaveBeenCalledWith(expect.any(Function));
    // 返り値が期待通りか確認
    expect(result).toEqual(returnedUser);
  });

  it('エラー処理', async () => {
    const mockUser: User = { user_name: 'Test User' };
    const errorMessage = 'Insertion failed';

    // モックがエラーを投げるように設定
    mockHandleSupabaseRequest.mockRejectedValueOnce(new Error(errorMessage));

    await expect(insertUser(mockUser)).rejects.toThrow(errorMessage);
  });
});
