// import {toJapanDateString} from './toJapanDateString';

// export function toJapanISOString(date: Date = new Date()): string {
//   const dateString = toJapanDateString(date);
  
//   const options: Intl.DateTimeFormatOptions = {
//     timeZone: 'Asia/Tokyo',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: false,
//   };

//   const formatter = new Intl.DateTimeFormat('ja-JP', options);
//   const timeParts = formatter.formatToParts(date);
//   const timePart: { [key: string]: string } = {};
//   timeParts.forEach(({ type, value }) => {
//     timePart[type] = value;
//   });

//   const hour = timePart.hour;
//   const minute = timePart.minute;
//   const second = timePart.second;

//   const isoString = `${dateString}T${hour}:${minute}:${second}+09:00`;
//   return isoString;
// }