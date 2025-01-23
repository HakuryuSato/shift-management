'use server';

import { Attendance } from '@/types/Attendance';
import { Holiday } from '@/types/Holiday';
import { toJapanISOString, toJapanDateISOString, createJSTDateFromISO, getJapanDateComponents } from '@/utils/common/dateUtils';
import { getHolidays } from './api/holidays';


// 注意：Vercelで実行される際はnew DateはUTCとなる

/** メイン関数
 * 打刻(stamp)を補正後(adjust)に変換して返す
 * @attendance:
 * params
 */
export async function generateAttendanceWorkMinutes(
    attendance: Attendance
): Promise<Partial<Attendance>> {
    const { attendance_id, stamp_start_time, stamp_end_time } = attendance;

    // 必須項目が欠けている場合は空の配列を返す
    if (!attendance_id || !stamp_start_time || !stamp_end_time) {
        return {};
    }

    // 祝日データを取得して日付の辞書を作成
    const holidays: Holiday[] = await getHolidays();
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    // 開始時間と終了時間をパースして30分単位に丸める
    const startTime = createJSTDateFromISO(stamp_start_time);
    const endTime = createJSTDateFromISO(stamp_end_time);
    const roundedStartDate = roundToNearest30Minutes(startTime, true);
    const roundedEndDate = roundToNearest30Minutes(endTime, false);

    // 合計分数取得
    const totalWorkMinutes = (roundedEndDate.getTime() - roundedStartDate.getTime()) / (1000 * 60);

    // 日本時間の年月日・時間を取得
    const startComponents = getJapanDateComponents(roundedStartDate);
    const endComponents = getJapanDateComponents(roundedEndDate);

    // 開始終了分数の計算
    // 開始終了分数(日付の開始から何分か)
    const startMinutes = startComponents.hours * 60 + startComponents.minutes;
    // 終了時間がもし24時になる(日付がstartより大きいかつ0分)なら分数を1440に固定
    const endMinutes =
        endComponents.hours === 0 && endComponents.date > startComponents.date
            ? 1440
            : endComponents.hours * 60 + endComponents.minutes;

    // 休憩時間を計算
    const restMinutes = calculateRestMinutes(startMinutes, endMinutes);
    const workMinutesAfterReduceRest = calculateWorkMinutes(totalWorkMinutes, restMinutes);

    // 祝日判定
    const isHolidayFlag = isHoliday(roundedStartDate, holidayDates);

    // 日曜日判定
    const isSundayFlag = isSunday(roundedStartDate);

    const { workMinutes, overtimeMinutes } = calculateOvertimeMinutes(
        workMinutesAfterReduceRest,
        isHolidayFlag,
        isSundayFlag
    );

    return {
        attendance_id: attendance_id,
        adjusted_start_time: toJapanISOString(roundedStartDate),
        adjusted_end_time: toJapanISOString(roundedEndDate),
        work_minutes: workMinutes,
        overtime_minutes: overtimeMinutes,
        rest_minutes: restMinutes,
    };

}






// 以下補助関数群  ---------------------------------------------------------------------------------------------------
/**
 * 祝日かどうかを判定する関数
 */
function isHoliday(date: Date, holidayDates: Set<string>): boolean {
    const dateStr = toJapanDateISOString(date);
    return holidayDates.has(dateStr);
}

/**
 *  日曜日かどうかを判定する関数
 */
function isSunday(date: Date): boolean {
    const { dayOfWeek } = getJapanDateComponents(date);
    return dayOfWeek === 0; // 日曜日は0
}

/**
 * 時間を30分単位に丸める
 */
function roundToNearest30Minutes(date: Date, isStart: boolean): Date {
    // JSTのオフセット（+9時間）をミリ秒単位で計算
    const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

    // UTC時間を取得
    const utcTime = date.getTime();

    // 日本時間に変換
    const japanTime = utcTime + JST_OFFSET_MS;

    // 日本時間での分を計算
    const japanDate = new Date(japanTime);
    let hours = japanDate.getHours();
    let minutes = japanDate.getMinutes();

    // // 30分単位で丸め
    if (isStart) { // 開始時間の場合
        if (minutes < 30) {
            minutes = 30;
        } else {
            minutes = 0;
            hours += 1;
        }
    } else { // 終了時間の場合
        if (minutes < 30) {
            minutes = 0;
        } else {
            minutes = 30;
        }
    }

    japanDate.setHours(hours, minutes, 0, 0);

    // const remainder = minutes % 30;
    // // 30分単位で丸め
    // if (remainder < 15) {
    //     japanDate.setMinutes(minutes - remainder);
    // } else {
    //     japanDate.setMinutes(minutes + (30 - remainder));
    // }

    // 再びUTC時間に変換
    const roundedJapanTime = japanDate.getTime();
    const roundedUtcTime = roundedJapanTime - JST_OFFSET_MS;

    // 元のDateオブジェクトに反映
    date.setTime(roundedUtcTime);

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
    isHoliday: boolean,
    isSunday: boolean
): { workMinutes: number; overtimeMinutes: number } {
    if (isHoliday || isSunday) {
        return { workMinutes: 0, overtimeMinutes: workMinutes };
    } else if (workMinutes > 480) {
        return { workMinutes: 480, overtimeMinutes: workMinutes - 480 };
    } else {
        return { workMinutes, overtimeMinutes: 0 };
    }
}

