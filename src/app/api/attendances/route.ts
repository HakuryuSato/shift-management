import { NextRequest } from 'next/server';
import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { Attendance } from '@/types/Attendance';

/**
 * 統合された範囲指定API
 * @param request 
 * @returns 
 */
export async function GET(request: NextRequest) {
    return handleApiRequest<Attendance[]>(async () => {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('user_id') || '*';
        const attendanceId = searchParams.get('attendance_id') || '*';

        const filterStartDateISO = searchParams.get('filterStartDateISO');
        const filterEndDateISO = searchParams.get('filterEndDateISO');

        // 開始終了時間が必要
        if (!(filterStartDateISO && filterEndDateISO)) {
            throw new Error('日付指定が必要です');
        }

        return await handleSupabaseRequest<Attendance[]>(async (supabase) => {
            const query = supabase
                .from('attendances')
                .select('*')
                .gte('work_date', filterStartDateISO)
                .lte('work_date', filterEndDateISO);

            // userIdフィルタリング
            if (userId !== '*') {
                query.eq('user_id', userId);
            }

            // attendanceIdフィルタリング
            if (attendanceId !== '*') {
                query.eq('attendance_id', attendanceId);
            }

            return query;
        });
    });
}
