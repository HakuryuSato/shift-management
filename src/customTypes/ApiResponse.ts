import InterFaceShiftQuery from './InterFaceShiftQuery';

export interface getShiftSuccessResponse {
    data: InterFaceShiftQuery[];
}

export interface getShiftErrorResponse {
    error: string;
}

export type getShiftAPIResponse = getShiftSuccessResponse | getShiftErrorResponse;