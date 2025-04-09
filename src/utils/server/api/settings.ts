import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

export async function getSetting(key: string): Promise<string | null> {
  return await handleSupabaseRequest<string | null>(async (supabase) => {
    return await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
  });
} 