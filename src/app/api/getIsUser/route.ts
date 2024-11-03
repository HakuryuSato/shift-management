import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/server/supabaseClient';

export async function GET(req: NextRequest) {
    const user_name = req.nextUrl.searchParams.get('user_name');

    const { data, error } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_name', user_name);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, { status: 200 });
    }
}