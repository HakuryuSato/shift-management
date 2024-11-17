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

        // adjustedまたはstampでの範囲指定
        const adjustedStartTimeISO = searchParams.get('adjusted_start_time');
        const adjustedEndTimeISO = searchParams.get('adjusted_end_time');
        const stampStartTimeISO = searchParams.get('stamp_start_time');
        const stampEndTimeISO = searchParams.get('stamp_end_time');

        // 調整または打刻の開始終了時間どちらかが必要
        if (!(adjustedStartTimeISO && adjustedEndTimeISO || stampStartTimeISO && stampEndTimeISO)) {
            throw new Error('adjusted_start_timeとadjusted_end_time、またはstamp_start_timeとstamp_end_timeのいずれかが必須です');
        }

        return await handleSupabaseRequest<Attendance[]>(async (supabase) => {
            const query = supabase
                .from('attendances')
                .select('*');

            // adjusted時間でのフィルタリング
            if (adjustedStartTimeISO && adjustedEndTimeISO) {
                query.gte('adjusted_start_time', adjustedStartTimeISO)
                    .lte('adjusted_end_time', adjustedEndTimeISO);
            }

            // stamp時間でのフィルタリング
            if (stampStartTimeISO && stampEndTimeISO) {
                query.gte('stamp_start_time', stampStartTimeISO)
                    .lte('stamp_end_time', stampEndTimeISO);
            }

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
