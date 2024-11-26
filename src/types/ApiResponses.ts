import InterFaceShiftQuery from '../types/InterFaceShiftQuery';
import { AutoShiftSettings } from './AutoShift';
import { Holiday } from '../types/Holiday';

// 共通のAPIレスポンス型
export interface ApiSuccess<T> {
    data: T;
}

export interface ApiError {
    error: string;
}

// 汎用のAPIレスポンスタイプ、成功ならば結果 | 失敗ならばエラー
export type APIResponse<T> = ApiSuccess<T> | ApiError;

// getShift
export type GetShiftAPIResponse = APIResponse<InterFaceShiftQuery[]>;

// GET auto-shift/settings
export type GetAutoShiftSettingsAPIResponse = APIResponse<AutoShiftSettings[]>;

// GET holidays
export type GetHolidaysAPIResponse = APIResponse<Holiday[]>;

// メッセージベースのレスポンス型
export type AutoShiftSettingsAPIResponse = APIResponse<string>;
