import React from "react";
import { EventContentArg } from "@fullcalendar/core";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";

// フルカレンダーのイベント描画に関する設定
const RenderEventContent: React.FC<{ eventInfo: EventContentArg }> = (
  { eventInfo },
) => {
  const customFullCalendarRole = useCustomFullCalendarStore((state) =>
    state.customFullCalendarRole
  );
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

    // 管理者の場合は異なる表示を返す
    if (customFullCalendarRole === "admin") {
      return (
        <div>
          <b>{eventInfo.event.title}</b>
        </div>
      );
    }

    // 通常のユーザー表示
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

export const renderEventContent = (eventInfo: EventContentArg) => (
  <RenderEventContent eventInfo={eventInfo} />
);
