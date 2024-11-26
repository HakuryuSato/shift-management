import { CustomFullCalendarEvent } from "@/types/CustomFullCalendarEvent";

/**
 * 指定した日付と userId に一致するイベントが存在するかを判定
 * @param date 'YYYY-MM-DD' の形式の日付
 * @param userId ユーザーID
 * @param events イベントの配列
 * @returns 一致するイベントがある場合は true を返す
 */
export const isUserCalendarEventOnDate = (date: string, userId: number, events: CustomFullCalendarEvent[]): boolean => {
    return events.some(event => {
        // start が string 型の場合
        const eventDate = event.start.split("T")[0];
        return eventDate === date && event.extendedProps?.user_id === userId;
    });
};