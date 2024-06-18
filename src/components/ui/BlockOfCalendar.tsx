import React from 'react';

interface BlockOfCalendarProps {
  text: string;
  bgColor: string;
  textColor: string
}

// TODO: テキストは中央揃え
const BlockOfCalendar: React.FC<BlockOfCalendarProps> = ({ text, bgColor, textColor }) => {
  return (
    <td className={`border p-2 h-20 ${bgColor}`}>
      <span className={textColor}>{text}</span>
    </td>
  );
};

export default BlockOfCalendar;
