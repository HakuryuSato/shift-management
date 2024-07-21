import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@api/supabase';

export async function DELETE(req: NextRequest) {
    const userName = req.nextUrl.searchParams.get('userName');

    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('user_name', userName);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, { status: 200 });
    }
}
