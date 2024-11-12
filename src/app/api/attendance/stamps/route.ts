import { NextRequest } from 'next/server';
import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { AttendanceStamp } from '@/types/Attendance';
/**
 * 
 * @param request 
 * @returns 
 */
export async function GET(request: NextRequest) {
    return handleApiRequest<AttendanceStamp[]>(async () => {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('user_id') || '*';
        const startTimeISO = searchParams.get('start_time');
        const endTimeISO = searchParams.get('end_time');

        if (!startTimeISO || !endTimeISO) {
            throw new Error('start_timeとend_timeは必須です');
        }

        const data = await handleSupabaseRequest<AttendanceStamp[]>(async (supabase) => {
            return supabase
                .from('attendance_stamps')
                .select(`
                    attendance_id,
                    user_id,
                    start_time,
                    end_time
                `)
                .gte('start_time', startTimeISO)
                .lte('start_time', endTimeISO)
                .eq('user_id', userId);
        });

        return data;
    });
}
