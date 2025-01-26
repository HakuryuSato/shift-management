// import React, { useState } from "react";

// interface OldTimeInputProps {
//   initialValue?: string;
//   onReturn: (time: string) => void;
// }

// //　廃止予定
// const OldTimeInput: React.FC<OldTimeInputProps> = ({ initialValue, onReturn }) => {
//   const [selectedTime, setSelectedTime] = useState(initialValue || "");

//   // 固定の時間オプションリスト
//   const timeOptions = [
//     "08:30",
//     "09:00",
//     "09:30",
//     "10:00",
//     "10:30",
//     "11:00",
//     "11:30",
//     "12:00",
//     "13:00",
//     "13:30",
//     "14:00",
//     "14:30",
//     "15:00",
//     "15:30",
//     "16:00",
//     "16:30",
//     "17:00",
//     "17:30",
//     "18:00",
//     "18:30",
//     "19:00",
//     "19:30",
//     "20:00",
//     "20:30",
//     "21:00",
//   ];

//   // 変更時にselectedTimeへ値をセットし、onReturnで親へ返す
//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const newTime = event.target.value;
//     setSelectedTime(newTime);
//     onReturn(newTime);
//   };

//   return (
//     <>
//       <select
//         value={selectedTime}
//         onChange={handleChange}
//         className="mt-4 p-2 border border-gray-300 rounded"
//         id="time-options"
//       >
//         {timeOptions.map((time) => (
//           <option key={time} value={time}>
//             {time}
//           </option>
//         ))}
//       </select>
//     </>
//   );
// };

// export default OldTimeInput;
