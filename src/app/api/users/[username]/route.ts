import { NextRequest } from 'next/server';
import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  return handleApiRequest(async () => {
    const { username } = params;
    const data = await handleSupabaseRequest(async (supabaseClient) => {
      return supabaseClient
        .from('users')
        .select('*')
        .eq('user_name', username)
        .single();
    });
    return data;
  });
}
