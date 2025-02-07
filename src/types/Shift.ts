import type { User } from '@/types/User'

/**
 * シフト取得APIのパラメータ型
 */
export interface GetShiftParams {
    userId?: string;
    shiftId?: string;
    filterStartDateISO: string;
    filterEndDateISO: string;
}

/**
 * シフトのクエリ型（検索・フィルタリング用）
 */
export interface ShiftQuery {
    user_id?: number;
    shift_id?: number;
    start_time?: string;  // ISO文字列
    end_time?: string;    // ISO文字列
    is_approved?: boolean;
}

/**
 * シフトの基本型（DBの構造に準拠）
 */
export interface Shift {
    shift_id?: number;
    user_id?: number;
    start_time: string;   // ISO文字列
    end_time: string;     // ISO文字列
    is_approved?: boolean;
}

/**
 * シフト配列の型（単一または複数のシフト）
 */
export type ShiftArray = Shift | Shift[];
