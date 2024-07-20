import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@api/supabase';

export async function GET(req: NextRequest) {
    const username = req.nextUrl.searchParams.get('username');

    const { data, error } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_name', username);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, { status: 200 });
    }
}