'use server';

import { supabase } from '@api/supabase';

export async function insertAttendance(user_id:number) {

  const userId = user_id;

  // 今日の日付を取得（時刻は00:00:00にリセット）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 今日の出勤記録を取得
  const { data: attendanceData, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', today.toISOString())
    .order('start_time', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error('データの取得に失敗しました: ' + error.message);
  }

  if (attendanceData && attendanceData.length > 0) {
    const attendance = attendanceData[0];

    if (!attendance.end_time) {
      // end_timeが未設定の場合、終了時間を設定
      const { error: updateError } = await supabase
        .from('attendances')
        .update({ end_time: new Date().toISOString() })
        .eq('attendance_id', attendance.attendance_id);

      if (updateError) {
        throw new Error('終了時間の更新に失敗しました: ' + updateError.message);
      }

      return { message: '終了時間を打刻しました' };
    } else {
      // 既に開始・終了時間がある場合、新たな出勤記録を作成
      const { error: insertError } = await supabase
        .from('attendances')
        .insert({
          user_id: userId,
          start_time: new Date().toISOString(),
        });

      if (insertError) {
        throw new Error('新しい出勤記録の作成に失敗しました: ' + insertError.message);
      }

      return { message: '新しい開始時間を打刻しました' };
    }
  } else {
    // 今日の記録がない場合、新しい出勤記録を作成
    const { error: insertError } = await supabase
      .from('attendances')
      .insert({
        user_id: userId,
        start_time: new Date().toISOString(),
      });

    if (insertError) {
      throw new Error('出勤記録の作成に失敗しました: ' + insertError.message);
    }

    return { message: '開始時間を打刻しました' };
  }
}
