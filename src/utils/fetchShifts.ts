import type InterFaceShiftQuery from '@/types/InterFaceShiftQuery';

type ShiftData = any;


export default async function fetchShifts({
    // 初期値
    user_id = '*',
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
    start_time,
    end_time,
}: InterFaceShiftQuery = {}): Promise<ShiftData[]> {
    try {
        // start_time と end_time が指定されている場合は優先
        const query = start_time && end_time 
            ? `/api/getShift?user_id=${user_id}&start_time=${start_time}&end_time=${end_time}`
            : `/api/getShift?user_id=${user_id}&year=${year}&month=${month}`;

        const response = await fetch(query);
        const responseData = await response.json();
        const data = responseData.data;

        return data;
    } catch (error) {
        console.error("Failed to fetch shifts:", error);
        return [];
    }
};
