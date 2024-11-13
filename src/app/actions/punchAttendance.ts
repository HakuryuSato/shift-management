'use server';

// サーバーアクション
import { insertAttendanceStamp } from './insertAttendanceStamp';
import { updateAttendanceStamp } from './updateAttendanceStamp';
import { upsertAttendanceResult } from './upsertAttendanceResult';

// utils
import { getTimeRangeISOStrings, toJapanISOString } from '@/utils/common/dateUtils';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { generateAttendanceResult } from '@/utils/server/generateAttendanceResult';

// 型
import type { AttendanceStamp } from '@/types/Attendance';


/**
 * 出退勤の打刻を行うサーバーアクション
 * @param userId ユーザーID
 * @returns AttendanceStamp
 */
export async function punchAttendance(userId: number): Promise<AttendanceStamp[]> {
    const now = new Date();
    const nowISO = toJapanISOString(now);

    // 当日の時間範囲を取得
    const { startTimeISO, endTimeISO } = getTimeRangeISOStrings('day', now);

    // 当日の出勤記録を取得
    const data = await handleSupabaseRequest<AttendanceStamp[]>(async (supabase) => {
        return supabase
            .from('attendance_stamps')
            .select('*')
            .eq('user_id', userId)
            .gte('start_time', startTimeISO)
            .lte('start_time', endTimeISO)
            .order('start_time', { ascending: false })
            .limit(1);
    });

    if (data && data.length > 0) { // データがあるなら
        const attendance_id = data[0]?.attendance_id;

        // end_timeを更新
        const attendanceStamp = await updateAttendanceStamp(attendance_id, nowISO);

        // 非同期で時間を計算してresultテーブルにupsert
        generateAttendanceResult(attendanceStamp[0])
            .then(attendanceResult => {
                upsertAttendanceResult(attendanceResult);
            })
            .catch(console.error); // エラーハンドリングを追加

        return attendanceStamp


    } else { // ないなら
        // 新しい出勤記録を作成
        return await insertAttendanceStamp(userId, nowISO);
    }
}
