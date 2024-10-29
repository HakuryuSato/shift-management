import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';

import { useSwipeable } from "react-swipeable";

export function CustomFullCalendar() {
  const calendarRef = useRef<FullCalendar>(null);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => calendarRef.current?.getApi().next(), // 次の月へ
    onSwipedRight: () => calendarRef.current?.getApi().prev(), // 前の月へ
    trackMouse: true, // マウスでのテストを可能にする（オプション）
  });

  const {
    customFullCalendarRole,
    customFullCalendarEvents,
    customFullCalendarBgColorsPerDay,
    customFullCalendarCurrentView,
    setCustomFullCalendarStartDate,
    setCustomFullCalendarEndDate,
    setCustomFullCalendarCurrentView,
    setCustomFullCalendarCurrentYear,
    setCustomFullCalendarCurrentMonth,
  } = useCustomFullCalendarStore();

  // イベントハンドラをコンポーネント内で定義
  const handleEventClick = (info: EventClickArg) => {
    console.log('イベントがクリックされました:', info.event);
  };

  const handleDateClick = (info: DateClickArg) => {
    console.log('日付がクリックされました:', info.dateStr);
  };

  const handleDownloadWeeklyData = () => {
    console.log('週次データのダウンロード');
  };

  const onBack = () => {
    console.log('戻るボタンがクリックされました');
  };

  const handleMultipleInputClick = () => {
    console.log('複数入力がクリックされました');
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    return <div>{eventInfo.event.title}</div>;
  };

  const plugins = [interactionPlugin];
  let initialView = '';
  let headerToolbar = {};
  let footerToolbar = {};
  let customButtons = {};
  let datesSetHandler = undefined;

  if (customFullCalendarRole === 'admin') {
    plugins.push(timeGridPlugin);
    initialView = 'timeGridWeek';
    headerToolbar = {
      left:
        customFullCalendarCurrentView === 'timeGridDay'
          ? 'timeGridWeek'
          : 'backToMenuButton',
      center: 'title',
      right: 'downloadWeeklyDataButton',
    };
    footerToolbar = {
      left: 'prev',
      center: '',
      right: 'next',
    };
    customButtons = {
      backToMenuButton: {
        text: '１ヶ月の画面へ',
        click: onBack,
      },
      downloadWeeklyDataButton: {
        text: '１週間のデータダウンロード',
        click: handleDownloadWeeklyData,
      },
    };
    datesSetHandler = (dateInfo: any) => {
      const newStartDate = new Date(dateInfo.start);
      const newEndDate = new Date(dateInfo.end);
      setCustomFullCalendarStartDate(newStartDate);
      setCustomFullCalendarEndDate(newEndDate);
      setCustomFullCalendarCurrentView(dateInfo.view.type);
    };
  } else if (customFullCalendarRole === 'user') {
    plugins.push(dayGridPlugin);
    initialView = 'dayGridMonth';
    headerToolbar=false
    // headerToolbar = {
    //   left: '',
    //   center: '',
    //   right: '',
    // };
    footerToolbar = {
      left: '',
      right: '',
    };

    datesSetHandler = (dateInfo: any) => {
      const fullCalendarDate = new Date(dateInfo.start);
      fullCalendarDate.setDate(fullCalendarDate.getDate() + 15);
      setCustomFullCalendarCurrentYear(fullCalendarDate.getFullYear());
      setCustomFullCalendarCurrentMonth(fullCalendarDate.getMonth());
    };
  }

  const dayCellClassNames = (info: any) => {
    const classes = [];
    const today = new Date();
    const dateStr = info.date
      .toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');

    // 今月の日曜日に灰色のテキストを適用
    if (
      info.date.getDay() === 0 &&
      info.date.getMonth() === today.getMonth()
    ) {
      classes.push('text-gray');
    }

    // 混雑状況に応じて背景色を適用
    if (customFullCalendarBgColorsPerDay[dateStr]) {
      classes.push(customFullCalendarBgColorsPerDay[dateStr]);
    }

    return classes.join(' ');
  };

  return (
    <div {...handlers}>
      <FullCalendar
        ref={calendarRef}
        plugins={plugins}
        initialView={initialView}
        height="auto"
        locale={jaLocale}
        events={customFullCalendarEvents}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        headerToolbar={headerToolbar}
        footerToolbar={footerToolbar}
        customButtons={customButtons}
        datesSet={datesSetHandler}
        dayCellClassNames={dayCellClassNames}
        {...(customFullCalendarRole === 'admin' && {
          slotMinTime: '08:00:00',
          slotMaxTime: '21:00:00',
          slotLabelInterval: '01:00:00',
          slotEventOverlap: false,
          eventOverlap: false,
          allDaySlot: true,
        })}
        {...(customFullCalendarRole === 'user' && {
          dayCellContent: (e: any) => e.dayNumberText.replace('日', ''),
          eventContent: renderEventContent,
          fixedWeekCount: false,
        })}
      />
    </div>
  );
}

export default CustomFullCalendar;
