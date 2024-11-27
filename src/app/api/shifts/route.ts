import { NextRequest } from 'next/server';
import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { Shift } from '@/types/Shift';

/**
 * 統合された範囲指定API
 * @param request 
 * @returns 
 */
export async function GET(request: NextRequest) {
    return handleApiRequest<Shift[]>(async () => {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('user_id') || '*';
        const shiftId = searchParams.get('shift_id') || '*';

        const filterStartDateISO = searchParams.get('filterStartTimeISO');
        const filterEndDateISO = searchParams.get('filterEndTimeISO');

        // 開始終了時間が必要
        if (!(filterStartDateISO && filterEndDateISO)) {
            throw new Error('日付指定が必要です');
        }

        return await handleSupabaseRequest<Shift[]>(async (supabase) => {
            const query = supabase
                .from('shifts')
                .select('*')
                .gte('start_time', filterStartDateISO)
                .lte('start_time', filterEndDateISO);

            // userIdフィルタリング
            if (userId !== '*') {
                query.eq('user_id', userId);
            }

            // shiftIdフィルタリング
            if (shiftId !== '*') {
                query.eq('shift_id', shiftId);
            }

            return query;
        });
    });
}
