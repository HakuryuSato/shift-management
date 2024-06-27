'use client'

// 一旦ユーザー用として使用予定
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useRef, useState } from 'react';
import { EventClickArg } from '@fullcalendar/core';

import UserShiftRegisterForm from '@forms/UserShiftRegisterForm'
import { userShiftListener } from '@/api/userShiftListener';

import getShift from '@api/getShift'
import type { InterFaceShiftQuery } from '@/customTypes/InterFaceShiftQuery';
import { PostgrestResponse } from '@supabase/supabase-js';


const userId: number = 1 // テスト用



// FullCalendar用にデータ整形
function formatEvents(data: any[]) {
  return data.map((shift) => ({
    start: shift.start_time,
    end: shift.end_time,
  }));
}

function createContext(userId: number, year: number, month: number) {
  const context: InterFaceShiftQuery = {
    query: {
      user_id: userId, // *****仮データ*****
      year: year,
      month: month
    }
  };

  return context
}


const DayGridCalendar: React.FC = () => { //以下コンポーネント--------------------------------------------------------------------------------------------
  // const calendarRef = useRef(null);

  // ---State---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [shiftEvents, setShiftEvents] = useState<{ start: string; end: string }[]>([]);





  // コンポーネントレンダー時にイベント取得
  useEffect(() => {
    // fetch関数実行
    updateEventData().catch(console.error);



  }, []);


  // 今月のイベントデータを取得しFullCalendarのStateにセットする関数
  const updateEventData = async () => {
    const context = createContext(userId, 2024, 6);
    const response = await getShift(context);
    const formattedEvents = formatEvents(response.props.data ?? []); // 戻り値ないなら空データ
    setShiftEvents(formattedEvents);
  };


  // イベント(予定)クリック時、入力用フォームをモーダルで表示
  const handleEventClick = (arg: EventClickArg) => {
    // setSelectedDate(arg.dateStr);
    // setIsModalOpen(true); // 削除ボタンのついた別のモーダルを表示する
  };



  // 日付クリック時、入力用フォームをモーダルで表示
  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };

  // モーダル非表示
  const closeModal = () => {
    setIsModalOpen(false);
    updateEventData()
  };

  // DBに変更があった際に呼ばれるハンドラ
  const handleShiftChange = () => {
    console.log('handleShiftChangehandleShiftChangehandleShiftChangehandleShiftChangehandleShiftChange')
    // const fetchData = async () => {
    //   const context = createContext(userId, 2024, 6);
    //   const response = await getShift(context);
    //   const formattedEvents = formatEvents(response.props.data ?? []); // 戻り値ないなら空データ
    //   setShiftEvents(formattedEvents);
    // };
    // fetchData().catch(console.error);
    updateEventData();
  }


  // FullCalendarのイベントの表示方法を変更するためのメソッド
  const renderEventContent = (eventInfo: any) => {
    const startTime = eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = eventInfo.event.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <div>
        <b>{startTime} - {endTime}</b><br />
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };





  // DB変更時、自動でシフトデータ取得
  userShiftListener(userId, handleShiftChange);


  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        // ref={calendarRef}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}

        height="auto"
        locale={jaLocale}
        dayCellContent={(e) => e.dayNumberText.replace('日', '')} // x日 の表記を消す
        events={shiftEvents}
        eventContent={renderEventContent}


        headerToolbar={{
          left: '',
          center: 'title',
          right: 'prev,next',
        }}
        dayCellClassNames={(arg) => { // 今月の日曜日だけ色を少し薄くする
          const today = new Date();
          return (
            arg.date.getDay() === 0 &&
            arg.date.getMonth() === today.getMonth()
          ) ? 'text-gray' : '';
        }}

      />


      <UserShiftRegisterForm isOpen={isModalOpen} onClose={closeModal} selectedDate={selectedDate} />

    </div>
  );
}



export default DayGridCalendar;
