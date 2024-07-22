import { supabase } from '@api/supabase';
// import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { NextRequest, NextResponse } from 'next/server';

// // Vercelのデータキャッシュ無効化(AdminShiftPageでユーザー名一覧がビルドしなおさないと更新されないため)
// export const fetchCache = 'force-no-store';

export const runtime = 'edge';

export async function GET(req: NextRequest, res: NextResponse) {

    const { data, error } = await supabase
        .from('users')
        .select('user_name')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ data }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store',
                'CDN-Cache-Control': 'no-store',
                'Vercel-CDN-Cache-Control': 'no-store'
            }
        });
    }

}