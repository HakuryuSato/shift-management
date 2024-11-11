import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/server/supabaseClient';
import type InterFaceShiftQuery from '@/types/InterFaceShiftQuery';

export async function POST(req: NextRequest) {
    const requestData = await req.json();
    const shiftDataArray = Array.isArray(requestData) ? requestData : [requestData];

    const { data, error } = await supabase
        .from('shifts')
        .insert(shiftDataArray);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, { status: 200 });
    }
}
