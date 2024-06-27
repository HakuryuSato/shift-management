import { useEffect } from 'react';
import { supabase } from '@utils/supabase/supabase';

export const userShiftListener = (userId: number, callback: () => void) => {
  const tableName: string = 'shifts';
  const columnName: string = 'user_id';

  useEffect(() => {
    const channel = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName, filter: `${columnName}=eq.${userId}` }, payload => {
        console.log('Change received!', payload);
        callback();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, callback]);
};

// サンプルINSERT操作
const insertShift = async (shiftData: { user_id: number; }) => {
  const { data, error } = await supabase
    .from('shifts')
    .insert([shiftData]);

  if (error) {
    console.error('Error inserting shift:', error);
    return;
  }

  console.log('Shift inserted successfully:', data);

  // INSERT操作が完了した後にデータを再取得
  const { data: newData, error: fetchError } = await supabase
    .from('shifts')
    .select('*')
    .eq('user_id', shiftData.user_id);

  if (fetchError) {
    console.error('Error fetching shifts:', fetchError);
    return;
  }

  console.log('Fetched shifts after insert:', newData);
};
