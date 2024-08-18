import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@api/supabase';
import type InterFaceShiftQuery from '@/customTypes/InterFaceShiftQuery';

export async function POST(req: NextRequest) {
    const { shift_id, start_time, end_time }: InterFaceShiftQuery = await req.json();

    const { data, error } = await supabase
        .from('shifts')
        .update({ start_time, end_time })
        .eq('id', shift_id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, { status: 200 });
    }
}
