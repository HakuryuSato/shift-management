// import { EventInput } from '@fullcalendar/core';
import { CustomFullCalendarEvent } from '@/customTypes/CustomFullCalendarEvent';
import { Shift } from '../customTypes/Shift';
import { Attendance } from '../customTypes/Attendance';
import { User } from '../customTypes/User';

// 共通のベース型を定義
type ShiftOrAttendance = Shift | Attendance;


// DBから取得したシフトまたは出退勤データをFullCalendar用に変換するための関数
// 引数のusersはユーザー名をフルカレに表示する必要がある場合に使用する
export function formatEventsForFullCalendar<T extends ShiftOrAttendance>(
    records: T[],
    users?: User[]
): CustomFullCalendarEvent[] {

    // 最初のレコードから型を定義
    const isShift = records.length > 0 && 'shift_id' in records[0];
    const idField = isShift ? 'shift_id' : 'attendance_id';


    const userMap = new Map<number, string>();
    // ユーザー名がある場合、ユーザー名の探索高速化のためMapを作成
    if (users) {
        users.forEach((user) => {
            if (user.user_id !== undefined && user.user_name !== undefined) {
                userMap.set(user.user_id, user.user_name);
            }
        });
    }

    return records.map((record) => {

        const id = record[idField as keyof ShiftOrAttendance];

        // ユーザー名を設定
        const user_name = userMap.get(record.user_id) || '';

        // end_time が null の場合は undefined に変換
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
}
