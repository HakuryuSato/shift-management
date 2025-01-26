// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";

// type DaySelectorProps = {
//     onDaysSelected: (selectedDays: number[]) => void;
// };

// const DaySelector: React.FC<DaySelectorProps> = ({ onDaysSelected }) => {
//     // クッキーから値取得
//     const initialSelectedDays = Cookies.get("selectedDays")
//         ? JSON.parse(Cookies.get("selectedDays")!)
//         : [];

//     const [selectedDays, setSelectedDays] = useState<number[]>(
//         initialSelectedDays,
//     );

//     useEffect(() => {
//         const savedDays = Cookies.get("selectedDays");
//         if (savedDays) {
//             setSelectedDays(JSON.parse(savedDays));
//         }
//         console.log("loop");
//     }, []);

//     const days = [
//         { name: "月", value: 1 },
//         { name: "火", value: 2 },
//         { name: "水", value: 3 },
//         { name: "木", value: 4 },
//         { name: "金", value: 5 },
//         { name: "土", value: 6 },
//     ];

//     const handleChange = (value: number) => {
//         const updatedDays = selectedDays.includes(value)
//             ? selectedDays.filter((day) => day !== value)
//             : [...selectedDays, value].sort((a, b) => a - b);

//         setSelectedDays(updatedDays);
//         Cookies.set("selectedDays", JSON.stringify(updatedDays), {
//             expires: 3650,
//         });
//         onDaysSelected(updatedDays);
//     };

//     return (
//         <div className="flex flex-col items-center space-y-2">
//             <div className="flex space-x-4">
//                 {days.map((day) => (
//                     <div key={day.value} className="flex flex-col items-center">
//                         <span className="text-gray-700">{day.name}</span>
//                         <input
//                             type="checkbox"
//                             value={day.value}
//                             checked={selectedDays.includes(day.value)}
//                             onChange={() =>
//                                 handleChange(day.value)}
//                             className="form-checkbox h-5 w-5 text-blue-600"
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default DaySelector;
