export const revalidate = 0; // 動的なエンドポイントとして定義(クエリパラメータがないためVercelで静的なAPIとして扱われるため)

import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

export async function GET() {
    return handleApiRequest(async () => {
        return await handleSupabaseRequest(async (supabaseClient) => {
            return supabaseClient
                .from('users')
                .select('user_id,user_name,employment_type');
        });
    });
}