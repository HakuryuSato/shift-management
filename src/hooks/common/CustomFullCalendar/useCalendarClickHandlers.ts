import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalContent } from "@/hooks/common/Modal/useModalContent"



export const useCalendarClickHandlers = () => {
    const customFullCalendarRole = useCustomFullCalendarStore((state) => state.customFullCalendarRole);
    const userId = useUserHomeStore((state) => state.userId);
    const setCustomFullCalendarClickedDate = useCustomFullCalendarStore((state) => state.setCustomFullCalendarClickedDate);
    const setCustomFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.setCustomFullCalendarClickedEvent);
    const openModal = useModalContainerStore((state) => state.openModal);
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const calendarViewMode = useCalendarViewToggleStore((state) => state.calendarViewMode) // 'ATTENDANCE' | 'PERSONAL_SHIFT' | 'ALL_MEMBERS_SHIFT';
    const showModalTopBarEditIcons = useModalTopBarStore((state) => state.showModalTopBarEditIcons)
    const hideModalTopBarEditIcons = useModalTopBarStore((state) => state.hideModalTopBarEditIcons)
    const { modalContentInitialize } = useModalContent()


    const handleClickEvent = (eventInfo: EventClickArg) => {
        // 終日イベント(祝日のみ)なら終了
        if (eventInfo.event.allDay) {
            console.log("祝日のため処理を行いません。");
            return;
        }

        

        // フルカレStoreにクリックされたEvent情報保存
        setCustomFullCalendarClickedEvent(eventInfo);

        // // userかつ自分のイベントの場合
        if (customFullCalendarRole === "user" && eventInfo.event.extendedProps.user_id == userId) {
            // 個人シフト画面なら編集アイコンを表示
            if (calendarViewMode === 'PERSONAL_SHIFT') {
                showModalTopBarEditIcons()
                modalContentInitialize('eventClick')
                setCustomFullCalendarClickedEvent(eventInfo);
                openModal();
            } else {
                hideModalTopBarEditIcons()
                // openModal('confirm');
            }
        }

        // // adminの場合（未実装）
        // if (customFullCalendarRole === "admin") {
        //     console.log("管理者としての処理を実行します。");
        // }

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
