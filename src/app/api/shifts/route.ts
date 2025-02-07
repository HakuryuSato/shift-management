import { NextRequest } from 'next/server';
import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { getShift } from '@/utils/server/api/shifts/getShift';
import type { Shift } from '@/types/Shift';

/**
 * 統合された範囲指定API
 * @param request 
 * @returns 
 */
export async function GET(request: NextRequest) {
    return handleApiRequest<Shift[]>(async () => {
        const searchParams = request.nextUrl.searchParams;
        
        return await getShift({
            userId: searchParams.get('user_id') || undefined,
            shiftId: searchParams.get('shift_id') || undefined,
            filterStartDateISO: searchParams.get('filterStartTimeISO') || '',
            filterEndDateISO: searchParams.get('filterEndTimeISO') || '',
        });
    });
}
