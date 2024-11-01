import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";

  export const handleClickEvent = (info: EventClickArg) => {
    console.log("イベントがクリックされました:", info.event);
  };

  export const handleClickDate = (info: DateClickArg) => {
    console.log("日付がクリックされました:", info.dateStr);
  };

  export const handleClickDownloadWeeklyData = () => {
    console.log("週次データのダウンロード");
  };

  export const handleClickToAttendance = () => {
    console.log("戻るボタンがクリックされました");
  };

  export const handleClickMultipleInput = () => {
    console.log("複数入力がクリックされました");
  };

  