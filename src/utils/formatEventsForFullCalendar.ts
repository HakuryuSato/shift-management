import { EventInput } from '@fullcalendar/core';
import { Shift } from '../customTypes/Shift';
import { Attendance } from '../customTypes/Attendance';

// 共通のベース型を定義
interface BaseRecord {
  user_id: string | number;
  start_time: string | number | Date;
  end_time?: string | number | Date | null;
  user_name?: string;
}

// フォーマットオプションの型定義
type FormatEventsOptions<T extends BaseRecord> = {
  eventIdField: keyof T;
  isAllMembersView?: boolean;
  additionalExtendedProps?: (keyof T)[];
};

// フォーマット関数の定義
export default function formatEventsForFullCalendar<T extends BaseRecord>(
  records: T[],
  options: FormatEventsOptions<T>
): EventInput[] {
  const {
    eventIdField,
    isAllMembersView = false,
    additionalExtendedProps = [],
  } = options;

  return records.map((record) => {
    // 追加プロパティを動的に処理
    const extendedProps: { [key: string]: any } = {};
    additionalExtendedProps.forEach((key) => {
      if (record[key] !== undefined) {
        extendedProps[key as string] = record[key];
      }
    });

    // タイトルの設定
    const title = isAllMembersView && record.user_name ? record.user_name : '';

    // end_time が null の場合は undefined に変換
    const endTime = record.end_time ?? undefined;

    return {
      id: String(record[eventIdField]),
      start: record.start_time,
      end: endTime,
      title: title,
      display: 'block',
      extendedProps: {
        user_id: record.user_id,
        ...extendedProps,
      },
    } as EventInput;
  });
}
