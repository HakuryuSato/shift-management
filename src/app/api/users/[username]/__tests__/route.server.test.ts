jest.mock('@/utils/server/handleSupabaseRequest', () => ({
    handleSupabaseRequest: jest.fn(),
}));

import { GET } from '../route';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { NextRequest } from 'next/server';

describe('GET /api/users/[username]', () => {
    const mockHandleSupabaseRequest = handleSupabaseRequest as jest.MockedFunction<typeof handleSupabaseRequest>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ユーザー情報を取得する', async () => {
        const username = 'TestUser';
        const request = new NextRequest('http://localhost/api/users/TestUser');
        const params = { username };
        const expectedData = { id: 1, user_name: 'TestUser' };

        // handleSupabaseRequest のモックを設定
        mockHandleSupabaseRequest.mockResolvedValueOnce(expectedData);

        // GET メソッドの呼び出し
        const response = await GET(request, { params });
        const result = await response.json();

        // モックが期待通りに呼び出されたか確認
        expect(mockHandleSupabaseRequest).toHaveBeenCalledWith(expect.any(Function));
        // レスポンスが期待通りか確認
        expect(result).toEqual({ data: expectedData });
    });

    it('エラー処理', async () => {
        const username = 'TestUser';
        const request = new NextRequest('http://localhost/api/users/TestUser');
        const params = { username };
        const errorMessage = '内部サーバーエラー';

        // handleSupabaseRequest のモックをエラーを返すよう設定
        mockHandleSupabaseRequest.mockRejectedValueOnce(new Error(errorMessage));

        // GET メソッドの呼び出し
        const response = await GET(request, { params });

        // ステータスコードとエラーメッセージの確認
        expect(response.status).toBe(500);
        const result = await response.json();
        expect(result).toEqual({ error: errorMessage });
    });
});
