import InterFaceShiftQuery from './InterFaceShiftQuery';



export interface SuccessResponse {
    message: string;
}

export interface ErrorResponse {
    error: string;
}


export interface getShiftSuccessResponse {
    data: InterFaceShiftQuery[];
}

export interface getShiftErrorResponse {
    error: string;
}


export type AutoShiftSettingsAPIResponse = SuccessResponse | ErrorResponse;
export type getShiftAPIResponse = getShiftSuccessResponse | getShiftErrorResponse;