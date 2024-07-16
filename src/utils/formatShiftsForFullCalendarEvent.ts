// FullCalendar用にイベントを整形
export default function formatShiftsForFullCalendarEvent(data: any[], useUserNameAsTitle: boolean = false) {


  return data.map((shift) => ({
    id: String(shift.shift_id),
    start: shift.start_time,
    end: shift.end_time,
    // useUserNameAsTitleがtrueならshift.user_name、falseならshift.title、どちらも無ければ空文字
    title: useUserNameAsTitle ? shift.user_name || '' : shift.title || '',
    display: 'block',


    backgroundColor: shift.is_approved ? 'green' : '',

    extendedProps: {// カスタムプロパティを追加
      is_approved: shift.is_approved,
      user_name:shift.user_name,
      user_id:shift.user_id,
    },
  }));
}
