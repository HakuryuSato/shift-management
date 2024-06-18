// components/Calendar.tsx
import React, { useState } from 'react';
import BlockOfCalendar from '@ui/BlockOfCalendar';
import Button from '@ui/Button';
import 'tailwindcss/tailwind.css';

const UserShiftCalender: React.FC = () => {
  const [date, setDate] = useState(new Date());

  const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const daysInPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  const weeks = [];
  let day = 1 - startDay;

  // カレンダー描画用ループ
  for (let i = 0; i < 6; i++) { // 縦のマス
    const week = [];
    for (let j = 0; j < 7; j++) { // 横のマス
      // const isWeekend = j === 0;
      let text, bgColor,textColor;


      // TODO:日曜日の色を変更する(注：日付もここで設定しているので、日付崩れていないか要確認)
      if (day > 0 && day <= daysInMonth) { // 今月
        text = String(day);
        bgColor = '';
        textColor='';
      } else if (day <= 0) { // 先月の日付セル
        text = String(daysInPrevMonth + day);
        bgColor = '';
        textColor='text-gray'
      } else { // 翌月の日付セル
        text = String(day - daysInMonth);
        bgColor = '';
        textColor='text-gray'
      }
      week.push(
        <BlockOfCalendar key={j} text={text} bgColor={bgColor} textColor={textColor} />
      );
      day++;
    }
    if (week.some(cell => cell.props.text !== '')) {
      weeks.push(<tr key={i}>{week}</tr>);
    }
  }

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex justify-between w-full max-w-3xl mb-4">
        <Button text="前の月" onClick={handlePrevMonth} />
        <div>{`${date.getFullYear()}年 ${date.getMonth() + 1}月`}</div>
        <Button text="次の月" onClick={handleNextMonth} />
      </div>
      <table className="w-full max-w-3xl border-collapse">
        <thead>
          <tr>
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <th key={index} className="border p-2">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{weeks}</tbody>
      </table>
    </div>
  );
};

export default UserShiftCalender;
