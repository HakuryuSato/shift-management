// import { supabase } from '@/utils/server/supabaseClient';
// import { NextRequest, NextResponse } from 'next/server';

// export const runtime = 'edge';

// // API名称はusersに変更予定

// export async function GET(req: NextRequest, res: NextResponse) {

//     const { data, error } = await supabase
//         .from('users')
//         .select('user_name, user_id')

//     if (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     } else {
//         return NextResponse.json({ data }, {
//             status: 200,
//             headers: {
//                 'Cache-Control': 'no-store',
//                 'CDN-Cache-Control': 'no-store',
//                 'Vercel-CDN-Cache-Control': 'no-store'
//             }
//         });
//     }

// }