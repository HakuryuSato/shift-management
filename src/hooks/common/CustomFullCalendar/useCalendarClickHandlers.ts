import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useModalStore } from "@/stores/common/modalSlice";


export const useCalendarClickHandlers = () => {
    const customFullCalendarRole = useCustomFullCalendarStore((state) => state.customFullCalendarRole);
    const userId = useUserHomeStore((state) => state.userId);
    const setCustomFullCalendarClickedDate = useCustomFullCalendarStore((state) => state.setCustomFullCalendarClickedDate);
    const setCustomFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.setCustomFullCalendarClickedEvent);
    const setIsModalVisible= useModalStore((state) => state.setIsModalVisible);


    const handleClickEvent = (eventInfo: EventClickArg) => {
        // 終日イベント(祝日のみ)なら終了
        if (eventInfo.event.allDay) {
            console.log("祝日のため処理を行いません。");
            return;
        }

        // 祝日でない場合、user/adminの役割に応じて処理
        if (customFullCalendarRole === "user") {
            setCustomFullCalendarClickedEvent(eventInfo)
            setIsModalVisible(true)


        } else { // admin の場合
            // イベントからユーザー名を取得して、上に表示できるようにする？
            console.log("管理者としての処理を実行します。");
        }

        // 選択されたイベント情報を表示
        console.log("選択されたイベント情報:", eventInfo);
    }


    const handleClickDate = (info: DateClickArg) => {
        console.log("日付がクリックされました:", info.dateStr);
    };



    return {
        handleClickEvent,
        handleClickDate,

    };
};
