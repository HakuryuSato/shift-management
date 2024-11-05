import { handleApiRequest } from '../handleApiRequest';
import { NextResponse } from 'next/server';

describe('handleApiRequest', () => {
    it('成功時にデータを返す', async () => {
        const mockData = { id: 1, name: 'Test Data' };
        const mockHandler = jest.fn().mockResolvedValue(mockData);

        const response = await handleApiRequest(mockHandler);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({ data: mockData });
        expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('データ取得エラー時に404を返す', async () => {
        const mockHandler = jest.fn().mockRejectedValue(new Error('データが取得できませんでした'));

        const response = await handleApiRequest(mockHandler);
        const result = await response.json();

        expect(response.status).toBe(404);
        expect(result).toEqual({ error: 'データが見つかりません' });
        expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('内部サーバーエラー時に500を返す', async () => {
        const mockHandler = jest.fn().mockRejectedValue(new Error('予期しないエラー'));

        const response = await handleApiRequest(mockHandler);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result).toEqual({ error: '内部サーバーエラー' });
        expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('不明なエラー時に500を返す', async () => {
        const mockHandler = jest.fn().mockRejectedValue('不明なエラー');

        const response = await handleApiRequest(mockHandler);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result).toEqual({ error: 'サーバーエラーが発生しました' });
        expect(mockHandler).toHaveBeenCalledTimes(1);
    });
});
