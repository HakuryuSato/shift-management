import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@api/supabase';
import type InterFaceShiftQuery from '@/customTypes/InterFaceShiftQuery';

export async function POST(req: NextRequest) {
    const { user_id, start_time, end_time }: InterFaceShiftQuery = await req.json();

    const { data, error } = await supabase
        .from('shifts')
        .insert([
            { start_time, end_time, user_id }
        ]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, { status: 200 });
    }
}
