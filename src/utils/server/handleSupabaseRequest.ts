'use server'
import { supabase } from '@/utils/server/supabaseClient';

// クエリビルダー関数の型定義
type QueryBuilder<T> = (supabaseClient: typeof supabase) => Promise<{ data: T | null; error: any }>;

/**
 * Supabaseクエリの実行とエラーハンドリングを共通化する関数
 * @param queryBuilder Supabaseクエリをビルドして実行する関数
 * @returns クエリ結果のデータ
 * @throws エラーが発生した場合
 */

export async function handleSupabaseRequest<T>(queryBuilder: QueryBuilder<T>): Promise<T> {
  const { data, error } = await queryBuilder(supabase);

  if (error) {
    throw new Error(error.message || 'Supabaseクエリ中にエラーが発生しました');
  }

  if (data === null) {
    throw new Error('データが取得できませんでした');
  }

  return data as T;
}
