'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

type UpdateSettingsParams = {
  key: string;
  value: string;
};

/**
 * 設定を更新するサーバーアクション
 * @param params 更新する設定のキーと値
 * @returns 更新された設定の値
 */
export async function updateSettings({ key, value }: UpdateSettingsParams): Promise<string> {
  if (!key) {
    throw new Error('key is required');
  }

  if (!value) {
    throw new Error('value is required');
  }

  const data = await handleSupabaseRequest<string>(async (supabase) => {
    return supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select('value')
      .single();
  });

  return data;
} 