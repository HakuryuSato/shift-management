'use server';

import { AttendanceStamp, AttendanceResult } from '@/types/Attendance';
import { Holiday } from '@/types/Holiday';
import { toJapanISOString, toJapanDateISOString } from '@/utils/common/dateUtils';
import { fetchHolidays } from '@/utils/client/apiClient';


/**
 * 祝日かどうかを判定する関数
 */
function isHoliday(date: Date, holidayDates: Set<string>): boolean {
    const dateStr = toJapanDateISOString(date);
    return holidayDates.has(dateStr);
}

/**
 * 時間を30分単位に丸める
 */
function roundToNearest30Minutes(date: Date): Date {
    const minutes = date.getMinutes();
    const remainder = minutes % 30;
    if (remainder < 15) {
        date.setMinutes(minutes - remainder);
    } else {
        date.setMinutes(minutes + (30 - remainder));
    }
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

/**
 * 12時から13時の休憩時間を計算
 */
function calculateRestMinutes(startMinutes: number, endMinutes: number): number {
    // 昼休み開始と終了の分数
    const lunchStart = 720; // 12 * 60
    const lunchEnd = 780;   // 13 * 60

    // 昼休み範囲に重なっていない場合は0を返す
    if (endMinutes <= lunchStart || startMinutes >= lunchEnd) return 0;

    // 昼休み全体を含む場合は60を返す
    if (startMinutes <= lunchStart && endMinutes >= lunchEnd) return 60;

    // 部分的に重なる場合はその重なり分を計算
    return (endMinutes < lunchEnd ? endMinutes : lunchEnd) -
        (startMinutes > lunchStart ? startMinutes : lunchStart);
}

/**
 * 総労働時間から休憩時間を引いて労働時間を計算
 */
function calculateWorkMinutes(totalMinutes: number, restMinutes: number): number {
    return totalMinutes - restMinutes;
}

/**
 * 休日や残業時間を計算
 */
function calculateOvertimeMinutes(
    workMinutes: number,
    isHoliday: boolean
): { workMinutes: number; overtimeMinutes: number } {
    if (isHoliday) {
        return { workMinutes: 0, overtimeMinutes: workMinutes };
    } else if (workMinutes > 480) {
        return { workMinutes: 480, overtimeMinutes: workMinutes - 480 };
    } else {
        return { workMinutes, overtimeMinutes: 0 };
    }
}

/**
 * AttendanceStampをAttendanceResultに変換
 */
export async function generateAttendanceResult(
    attendanceStamp: AttendanceStamp
): Promise<AttendanceResult[]> {
    const { attendance_id, start_time, end_time } = attendanceStamp;

    // 必須項目が欠けている場合は空の配列を返す
    if (!attendance_id || !start_time || !end_time) {
        return [];
    }

    // 祝日データを取得して日付の辞書を作成
    const holidays: Holiday[] = await fetchHolidays();
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    // 開始時間と終了時間をパースして30分単位に丸める
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    const roundedStartDate = roundToNearest30Minutes(new Date(startDate));
    const roundedEndDate = roundToNearest30Minutes(new Date(endDate));

    // 合計分数取得
    const totalWorkMinutes = (roundedEndDate.getTime() - roundedStartDate.getTime()) / (1000 * 60);

    // 開始終了分数(日付の開始から何分か)
    const startMinutes = roundedStartDate.getHours() * 60 + roundedStartDate.getMinutes();
    // 終了時間がもし24時になる(日付がstartより大きいかつ0分)なら分数を1440に固定
    const endMinutes =
        roundedEndDate.getHours() === 0 && roundedEndDate.getDate() > startDate.getDate()
            ? 1440
            : roundedEndDate.getHours() * 60 + roundedEndDate.getMinutes();

    // 休憩時間を計算
    const restMinutes = calculateRestMinutes(startMinutes, endMinutes);
    const workMinutesAfterReduceRest = calculateWorkMinutes(totalWorkMinutes, restMinutes);

    // 祝日判定
    const isHolidayFlag = isHoliday(roundedStartDate, holidayDates);

    const { workMinutes, overtimeMinutes } = calculateOvertimeMinutes(
        workMinutesAfterReduceRest,
        isHolidayFlag
    );

    return [
        {
            attendance_id,
            work_start_time: toJapanISOString(roundedStartDate),
            work_end_time: toJapanISOString(roundedEndDate),
            work_minutes: workMinutes,
            overtime_minutes: overtimeMinutes,
            rest_minutes: restMinutes,
        },
    ];
}
