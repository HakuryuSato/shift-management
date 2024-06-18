import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
// import '@fullcalendar/common/main.min.css';
// import '@fullcalendar/daygrid/main.min.css';

const timeGridCalendar: React.FC = () => {
  return (
    <div className="container mx-auto mt-10">
      <FullCalendar plugins={[timeGridPlugin]} initialView="timeGrid" />
    </div>
  );
};

export default timeGridCalendar;
