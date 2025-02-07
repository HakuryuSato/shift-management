import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { Shift, GetShiftParams } from '@/types/Shift';

export async function getShift({
    userId = '*',
    shiftId = '*',
    filterStartDateISO,
    filterEndDateISO,
}: GetShiftParams): Promise<Shift[]> {
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
}
