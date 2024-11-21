import { EventInput } from '@fullcalendar/core';

export interface CustomFullCalendarEvent extends EventInput {
  extendedProps?: {
    user_id?: number;
    user_name?: string;
    isHoliday?: boolean;
  };
}
