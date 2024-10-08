import InterFaceShiftQuery from './InterFaceShiftQuery';
import { AutoShiftSettings } from './AutoShiftTypes';

// 汎用
export interface SuccessResponse {
    message: string;
}

export interface ErrorResponse {
    error: string;
}


// getShift
export interface getShiftSuccessResponse {
    data: InterFaceShiftQuery[];
}

export interface getShiftErrorResponse {
    error: string;
}

export interface FetchAutoShiftSettingsSuccessResponse {
    data: AutoShiftSettings[];
  }
  
  export interface FetchAutoShiftSettingsErrorResponse {
    error: string;
  }

export type FetchAutoShiftSettingsAPIResponse = FetchAutoShiftSettingsSuccessResponse | FetchAutoShiftSettingsErrorResponse;
export type AutoShiftSettingsAPIResponse = SuccessResponse | ErrorResponse;
export type getShiftAPIResponse = getShiftSuccessResponse | getShiftErrorResponse;