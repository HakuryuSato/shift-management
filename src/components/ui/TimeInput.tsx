// src/components/TimeInput.tsx
import React, { useState } from 'react';

interface TimeInputProps {
  initialValue?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ initialValue }) => {
  const [selectedTime, setSelectedTime] = useState(initialValue || '');

  // 固定の時間オプションリスト
  const timeOptions = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  return (
    <>
      <select
        value={selectedTime}
        onChange={handleChange}
        className="mt-4 p-2 border border-gray-300 rounded"
        id="time-options"
      >
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </>
  );
};

export default TimeInput;
