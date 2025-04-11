import { GET } from '../route';
import { getSetting } from '@/utils/server/api/settings';

jest.mock('@/utils/server/api/settings', () => ({
  getSetting: jest.fn(),
}));

describe('api/settings/route', () => {
  const mockGetSetting = getSetting as jest.MockedFunction<typeof getSetting>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('設定を取得する', async () => {
    const key = 'closing-date';
    const value = '25';
    const request = new Request(`http://localhost/api/settings?key=${key}`);

    mockGetSetting.mockResolvedValueOnce(value);

    const response = await GET(request);
    const data = await response.json();

    expect(mockGetSetting).toHaveBeenCalledWith(key);
    expect(data).toEqual({ data: value });
  });

  it('keyが未指定の場合、エラーを返す', async () => {
    const request = new Request('http://localhost/api/settings');

    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({ error: 'key parameter is required' });
    expect(response.status).toBe(400);
  });

  it('エラー処理', async () => {
    const key = 'closing-date';
    const errorMessage = 'Failed to fetch setting';
    const request = new Request(`http://localhost/api/settings?key=${key}`);

    mockGetSetting.mockRejectedValueOnce(new Error(errorMessage));

    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({ error: errorMessage });
    expect(response.status).toBe(500);
  });
}); 