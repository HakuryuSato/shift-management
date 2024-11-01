import React from "react";
import { EventContentArg } from "@fullcalendar/core";

// フルカレンダーのイベント描画に関する設定
export const renderEventContent = (eventInfo: EventContentArg) => {
    if (eventInfo.event.extendedProps.isHoliday) { // 祝日イベント
      // 祝日を設定
      return (
        <div>
          <b>{eventInfo.event.title}</b>
        </div>
      );
    } else { // それ以外
      // Existing shift event rendering
      const startTime = eventInfo.event.start?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = eventInfo.event.end?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div>
          <b>
            {startTime} -
            <br />
            {endTime}
          </b>
          <br />
          <i>{eventInfo.event.title}</i>
        </div>
      );
    }
  };