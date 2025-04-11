jest.mock('@/utils/server/handleSupabaseRequest', () => ({
  handleSupabaseRequest: jest.fn(),
}));

import { updateSettings } from '../updateSettings';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

describe('actions/updateSettings', () => {
  const mockHandleSupabaseRequest = handleSupabaseRequest as jest.MockedFunction<typeof handleSupabaseRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('設定を更新する', async () => {
    const key = 'closing-date';
    const value = '25';
    const returnedValue = '25';

    mockHandleSupabaseRequest.mockResolvedValueOnce(returnedValue);

    const result = await updateSettings({ key, value });

    expect(mockHandleSupabaseRequest).toHaveBeenCalledWith(expect.any(Function));
    expect(result).toEqual(returnedValue);
  });

  it('keyが未指定の場合、エラーを投げる', async () => {
    await expect(updateSettings({ key: '', value: '25' }))
      .rejects
      .toThrow('key is required');
  });

  it('valueが未指定の場合、エラーを投げる', async () => {
    await expect(updateSettings({ key: 'closing-date', value: '' }))
      .rejects
      .toThrow('value is required');
  });

  it('エラー処理', async () => {
    const key = 'closing-date';
    const value = '25';
    const errorMessage = 'Update failed';

    mockHandleSupabaseRequest.mockRejectedValueOnce(new Error(errorMessage));

    await expect(updateSettings({ key, value }))
      .rejects
      .toThrow(errorMessage);
  });
}); 