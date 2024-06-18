import React from 'react';
import FullCalendar from '@fullcalendar/react';
import TimeGridPlugin from '@fullcalendar/timegrid';
import jaLocale from '@fullcalendar/core/locales/ja';


const TimeGridCalendar: React.FC = () => {
  return (
    <div>
      <FullCalendar
        plugins={[TimeGridPlugin]}
        initialView="timeGridWeek"
        height="auto"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        }}
        locale={jaLocale}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        // slotDuration="00:30:00" // スロットを区切る頻度(deffault 30min)
        slotLabelInterval="01:00:00" // ラベルテキストを表示する頻度

      />
    </div>
  );
};

export default TimeGridCalendar;
