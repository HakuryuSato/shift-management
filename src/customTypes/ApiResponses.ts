import InterFaceShiftQuery from './InterFaceShiftQuery';
import { AutoShiftSettings } from './AutoShiftTypes';
import { Holiday } from './Holiday';

// 共通のAPIレスポンス型
export interface ApiSuccess<T> {
    data: T;
}

export interface ApiError {
    error: string;
}

// 汎用のAPIレスポンスタイプ
export type APIResponse<T> = ApiSuccess<T> | ApiError;

// getShift
export type GetShiftAPIResponse = APIResponse<InterFaceShiftQuery[]>;

// GET auto-shift/settings
export type GetAutoShiftSettingsAPIResponse = APIResponse<AutoShiftSettings[]>;

// GET holidays
export type GetHolidaysAPIResponse = APIResponse<Holiday[]>;

// メッセージベースのレスポンス型
export type AutoShiftSettingsAPIResponse = APIResponse<string>;
