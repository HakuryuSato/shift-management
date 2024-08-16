import type InterFaceShiftQuery from '@customTypes/InterFaceShiftQuery';

type ShiftData = any;


export default async function fetchShifts({
    // 初期値
    user_id = '*',
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
}: InterFaceShiftQuery = {}): Promise<ShiftData[]> {
    try {
        const response = await fetch(
            `/api/getShift?user_id=${user_id}&year=${year}&month=${month}`,
        );
        const responseData = await response.json();
        const data = responseData.data;

        return data;
    } catch (error) {
        console.error("Failed to fetch shifts:", error);
        return [];
    }
};