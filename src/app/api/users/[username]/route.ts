import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/server/supabaseClient';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    const { username } = params;

    const { data, error } = await supabase
        .from('users')
        .select('*') // 全てのカラムを取得
        .eq('user_name', username)
        .single(); // 単一のレコードを取得

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
}
