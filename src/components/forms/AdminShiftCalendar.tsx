import React from 'react';
import Button from '@ui/Button';

const AdminShiftCalendar: React.FC = () => {
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  const staff = [
    { name: '山田', total: 40 },
    { name: '佐藤', total: 38 },
    { name: '鈴木', total: 36 },
  ];

  return (
    <div className="w-full p-4">
      <table className="w-full table-fixed border-collapse border">
        <thead>
          <tr>
            <th className="border px-2 py-1">名前</th>
            <th className="border px-2 py-1">合計時間</th>
            {days.map((day) => (
              <th key={day} className="border px-2 py-1">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.name}>
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.total}</td>
              {days.map((day, index) => (
                <td key={index} className="border px-2 py-1">
                  <Button text="シフト" onClick={() => alert(`${s.name}の${day}のシフト`)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminShiftCalendar;
