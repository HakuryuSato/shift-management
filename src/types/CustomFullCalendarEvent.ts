import { EventInput } from '@fullcalendar/core';

/**
 *  実際に使用している内容(src\utils\client\formatEventsForFullCalendar.ts)
 * id: String(id),
    start: record.start_time,
    end: endTime,
    title: user_name,
    display: 'block',
    extendedProps: {
      user_id: record.user_id,
      user_name: user_name,
    },
 * 
 */

export interface CustomFullCalendarEvent extends EventInput {
  extendedProps?: {
    user_id?: number;
    user_name?: string;
    isHoliday?: boolean;
  };
}
