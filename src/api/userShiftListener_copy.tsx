import { useEffect } from 'react';
import { supabase } from '@utils/supabase/supabase';


// shiftテーブルを監視、変更があった場合にコールバック実行
export const userShiftListener = (userId: number, callback: () => void) => {

  const tableName: string = 'shifts'
  const columnName: string = 'user_id'

  useEffect(() => {
    const channel = supabase
    .channel(`public:${tableName}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName, filter: `${columnName}=eq.${userId}` }, callback)
    .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, callback]);
};
