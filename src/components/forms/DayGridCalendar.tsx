import dayGridPlugin from '@fullcalendar/daygrid';
import React, { useEffect, useRef } from 'react';
import jaLocale from '@fullcalendar/core/locales/ja';
import FullCalendar from '@fullcalendar/react';

// TODO:日曜日に登録できないような対策が必要


const DayGridCalendar: React.FC = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          left: '',
          center: 'title',
          right: 'prev,next',
        }}

        // footerToolbar={{
        //   left: '',
        //   center: '',
        //   right: 'prev,next',
        // }}
        locale={jaLocale}
        dayCellContent={(e) => e.dayNumberText.replace('日', '')} // x日 の表記を消す

        dayCellClassNames={(arg) => { //今月の日曜日だけ色を少し薄くする
          const today = new Date();
          return (

          arg.date.getDay() === 0 && 
          arg.date.getMonth() === today.getMonth()
          ) ? 'text-gray' : '';


        }}

      />
    </div>
  );
}



export default DayGridCalendar;
