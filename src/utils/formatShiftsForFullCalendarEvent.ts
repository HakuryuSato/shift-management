// FullCalendar用にイベントを整形
export default function formatShiftsForFullCalendarEvent(data: any[], useUserNameAsTitle: boolean = false) {


  return data.map((shift) => ({
    id: String(shift.shift_id),
    start: shift.start_time,
    end: shift.end_time,
    // useUserNameAsTitleがtrueならshift.user_name、falseならshift.title、どちらも無ければ空文字
    title: useUserNameAsTitle ? shift.user_name || '' : shift.title || '', 
    display: 'block',

    // description: `${shift.start_time} - ${shift.end_time}`, // 時間を2行で表示するためのdescriptionフィールド
    // classNames: shift.is_approved ? ['green']:'',

    backgroundColor: shift.is_approved ? 'green' : '',
  }));
}
