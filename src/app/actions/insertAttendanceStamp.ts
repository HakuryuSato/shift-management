'use server';

import { supabase } from '@/utils/server/supabaseClient';
import { toJapanISOString } from '@/utils/toJapanISOString';

// 共通のsupabase関数を使う形式にリファクタリングすること
// 既に存在するなら新たに作成ではなく、end_time更新とすること

export async function insertAttendanceStamp(userId:number) {

  // 今日の日付を取得（時刻は00:00:00にリセット）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 今日の出勤記録を取得
  const { data: attendanceData, error } = await supabase
    .from('attendance_stamps')
    .select('*')
    .eq('user_id', userId)
    .gte('stamp_start_time', toJapanISOString(today))
    .order('stamp_start_time', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error('データの取得に失敗しました: ' + error.message);
  }

  if (attendanceData && attendanceData.length > 0) {
    const attendance = attendanceData[0];

    if (!attendance.end_time) {
      // end_timeが未設定の場合、終了時間を設定
      const { error: updateError } = await supabase
        .from('attendance_stamps')
        .update({ end_time: toJapanISOString(new Date()) })
        .eq('attendance_id', attendance.attendance_id);

      if (updateError) {
        throw new Error('終了時間の更新に失敗しました: ' + updateError.message);
      }

      return { message: '終了時間を打刻しました' };
    } else {
      // 既に開始・終了時間がある場合、新たな出勤記録を作成
      const { error: insertError } = await supabase
        .from('attendances_stamps')
        .insert({
          user_id: userId,
         stamp_start_time: toJapanISOString(new Date()),
        });

      if (insertError) {
        throw new Error('新しい出勤記録の作成に失敗しました: ' + insertError.message);
      }

      return { message: '新しい開始時間を打刻しました' };
    }
  } else {
    // 今日の記録がない場合、新しい出勤記録を作成
    const { error: insertError } = await supabase
      .from('attendance_stamps')
      .insert({
        user_id: userId,
       stamp_start_time: toJapanISOString(new Date()),
      });

    if (insertError) {
      throw new Error('出勤記録の作成に失敗しました: ' + insertError.message);
    }

    return { message: '開始時間を打刻しました' };
  }
}
