import { handleSupabaseRequest } from '../handleSupabaseRequest';
import { supabase } from '@/utils/server/supabaseClient';

jest.mock('@/utils/server/supabaseClient', () => ({
    supabase: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
    },
}));

describe('handleSupabaseRequest', () => {
    it('正常にデータを取得する', async () => {
        const mockData = { id: 1, name: 'Test Data' };
        const mockQueryBuilder = jest.fn().mockResolvedValue({ data: mockData, error: null });

        const result = await handleSupabaseRequest(mockQueryBuilder);

        expect(mockQueryBuilder).toHaveBeenCalledWith(supabase);
        expect(result).toEqual(mockData);
    });

    it('エラーが発生した場合にエラーをスローする', async () => {
        const mockError = { message: 'クエリエラー' };
        const mockQueryBuilder = jest.fn().mockResolvedValue({ data: null, error: mockError });

        await expect(handleSupabaseRequest(mockQueryBuilder)).rejects.toThrow('クエリエラー');
    });

    it('データがnullの場合にエラーをスローする', async () => {
        const mockQueryBuilder = jest.fn().mockResolvedValue({ data: null, error: null });

        await expect(handleSupabaseRequest(mockQueryBuilder)).rejects.toThrow('データが取得できませんでした');
    });

    it('エラーメッセージがない場合にデフォルトエラーメッセージをスローする', async () => {
        const mockError = {};
        const mockQueryBuilder = jest.fn().mockResolvedValue({ data: null, error: mockError });

        await expect(handleSupabaseRequest(mockQueryBuilder)).rejects.toThrow('Supabaseクエリ中にエラーが発生しました');
    });
});
