import { CustomFullCalendarEvent } from '@/types/CustomFullCalendarEvent';
import { Shift } from '../../types/Shift';
import { Attendance } from '../../types/Attendance';
import { User } from '../../types/User';

// 関数のオーバーロードを定義
export function formatEventsForFullCalendar(records: Shift[], users?: User[]): CustomFullCalendarEvent[];
export function formatEventsForFullCalendar(records: Attendance[], users?: User[]): CustomFullCalendarEvent[];

// 実装本体
export function formatEventsForFullCalendar(
  records: Shift[] | Attendance[],
  users?: User[]
): CustomFullCalendarEvent[] {
  if (records.length === 0) {
    return [];
  }

  const userMap = new Map<number, string>();
  if (users) {
    users.forEach((user) => {
      if (user.user_id !== undefined && user.user_name !== undefined) {
        userMap.set(user.user_id, user.user_name);
      }
    });
  }

  // 型ガード関数を定義
  const isShiftArray = (records: Shift[] | Attendance[]): records is Shift[] =>
    'shift_id' in records[0];

  if (isShiftArray(records)) {
    // Shift型の処理
    return records.map((record) => {
      const id = record.shift_id ?? '';
      const user_name = record.user_id ? userMap.get(record.user_id) || '' : '';
      const endTime = record.end_time ?? undefined;

      return {
        id: String(id),
        start: record.start_time,
        end: endTime,
        title: user_name,
        display: 'block',
        extendedProps: {
          user_id: record.user_id,
          user_name: user_name,
        },
      } as CustomFullCalendarEvent;
    });
  } else {
    // Attendance型の処理
    return records.map((record) => {
      const id = record.attendance_id;
      const user_name = record.user_id ? userMap.get(record.user_id) || '' : '';
      const startTime = record.adjusted_start_time ?? record.stamp_start_time;
      const endTime = record.adjusted_end_time ?? record.stamp_end_time ?? undefined;

      return {
        id: String(id),
        start: startTime,
        end: endTime,
        title: user_name,
        display: 'block',
        extendedProps: {
          user_id: record.user_id,
          user_name: user_name,
        },
      } as CustomFullCalendarEvent;
    });
  }
}
