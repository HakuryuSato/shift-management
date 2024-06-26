import { useEffect } from 'react';
import { supabase } from '@utils/supabase/supabase';


// shiftテーブルを監視、変更があった場合にコールバック実行
export const userShiftListener = (userId: number, callback: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel(`shifts:userid=eq.${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shifts', filter: `userid=eq.${userId}` }, callback)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shifts', filter: `userid=eq.${userId}` }, callback)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'shifts', filter: `userid=eq.${userId}` }, callback)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, callback]);
};
