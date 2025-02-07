import type { User } from '@/types/User'

// シフト取得APIのパラメータ型
export interface GetShiftParams {
    userId?: string;
    shiftId?: string;
    filterStartDateISO: string;
    filterEndDateISO: string;
}

// DBの構造と同じ型 + サバアクの送信で使用している型
export interface Shift {
    shift_id?: number;
    user_id?: number;
    start_time: string; // ISO文字列
    end_time?: string;
}
