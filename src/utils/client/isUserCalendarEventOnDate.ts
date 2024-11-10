import { CustomFullCalendarEvent } from "@/customTypes/CustomFullCalendarEvent";

/**
 * 指定した日付と userId に一致するイベントが存在するかを判定
 * @param date 'YYYY-MM-DD' の形式の日付
 * @param userId ユーザーID
 * @param events イベントの配列
 * @returns 一致するイベントがある場合は true を返す
 */
export const isUserCalendarEventOnDate = (date: string, userId: number, events: CustomFullCalendarEvent[]): boolean => {
    return events.some(event => {
        // `event.start`が文字列ならそのまま使用し、DateならISO文字列へ変換
        const eventDate = typeof event.start === "string"
            ? event.start.split("T")[0]
            : event.start instanceof Date
                ? event.start.toISOString().split("T")[0]
                : null;

        return eventDate === date && event.extendedProps?.user_id === userId;
    });
};

