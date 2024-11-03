import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

// handleSupabaseRequestをモック
jest.mock('@/utils/server/handleSupabaseRequest');

/**
 * handleSupabaseRequestのモック関数を取得する
 */
export function getMockHandleSupabaseRequest() {
  return handleSupabaseRequest as jest.MockedFunction<typeof handleSupabaseRequest>;
}

/**
 * テスト前にモックをクリアする
 */
export function clearAllMocks() {
  beforeEach(() => {
    jest.clearAllMocks();
  });
}
