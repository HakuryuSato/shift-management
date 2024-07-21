import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@api/supabase';

export async function DELETE(req: NextRequest) {
    const shiftId = req.nextUrl.searchParams.get('shiftId');

    const { data, error } = await supabase
        .from('shifts')
        .delete()
        .eq('shift_id', shiftId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, { status: 200 });
    }
}
