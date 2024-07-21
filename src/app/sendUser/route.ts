import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@api/supabase';

export async function POST(req: NextRequest) {
    const { userName } = await req.json();

    const { data, error } = await supabase
        .from('users')
        .insert({ user_name: userName });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, { status: 200 });
    }
}
