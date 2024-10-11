import { GET } from './route';
import { NextRequest } from 'next/server';
import { supabase } from '@api/supabase';
import { mocked } from 'jest-mock';

jest.mock('@api/supabase');
const mockSupabase = mocked(supabase, { shallow: false });

describe('Auto Shift Settings API', () => {
  describe('GET /api/auto_shift/settings', () => {
    it('should return settings', async () => {
      const mockData = [
        { auto_shift_setting_id: 1, user_id: 'user123', is_enabled: true },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const req = new NextRequest('http://localhost/api/auto_shift/settings');
      const response = await GET(req);
      const json = await response.json();

      expect(json).toEqual({ data: mockData });
      expect(response.status).toBe(200);
    });
  });
});
