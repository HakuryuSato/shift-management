import dayGridPlugin from '@fullcalendar/daygrid';
import React, { useEffect, useRef, useState } from 'react';
import jaLocale from '@fullcalendar/core/locales/ja';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import UserShiftRegisterForm from '@forms/UserShiftRegisterForm'


const DayGridCalendar: React.FC = () => {

  // モーダル用State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // クリック時、入力用フォームをモーダルで表示
  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };

  // モーダル非表示
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        height="auto"
        headerToolbar={{
          left: '',
          center: 'title',
          right: 'prev,next',
        }}

        // footerToolbar={{ //
        //   left: '',
        //   center: '',
        //   right: 'prev,next',
        // }}


        locale={jaLocale}
        dayCellContent={(e) => e.dayNumberText.replace('日', '')} // x日 の表記を消す

        dayCellClassNames={(arg) => { // 今月の日曜日だけ色を少し薄くする
          const today = new Date();
          return (
            arg.date.getDay() === 0 &&
            arg.date.getMonth() === today.getMonth()
          ) ? 'text-gray' : '';
        }}

      />


      <UserShiftRegisterForm isOpen={isModalOpen} onClose={closeModal} title={selectedDate} />

    </div>
  );
}



export default DayGridCalendar;
