// // FullCalendar用にイベントを整形

// import {}
import { Attendance } from "@/customTypes/Attendance";

export function formatEventsForFullCalendar(data: Attendance[]) {


    return data.map((shift) => ({
      id: String(shift.attendance_id),
      start: shift.start_time,
      end: shift.end_time,
      // useUserNameAsTitleがtrueならshift.user_name、falseならshift.title、どちらも無ければ空文字
    //   title: isAllMembersView ? shift.user_name || '' : shift.title || '',
      display: 'block',
  
      // backgroundColor: shift.is_approved ? 'green' : '',
  
    //   extendedProps: {// カスタムプロパティを追加
    //     is_approved: shift.is_approved,
    //     user_name: shift.user_name,
    //     user_id: shift.user_id,
    //   },
    }));
  }
  