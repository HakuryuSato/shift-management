import { useEffect } from "react";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalContent } from "@/hooks/common/Modal/useModalContent"

/**
 * 
 * @returns 
 */
export const useCalendarClickHandlers = () => {
    const customFullCalendarRole = useCustomFullCalendarStore((state) => state.customFullCalendarRole);
    const userId = useUserHomeStore((state) => state.userId);
    const setCustomFullCalendarClickedDate = useCustomFullCalendarStore((state) => state.setCustomFullCalendarClickedDate);
    const setCustomFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.setCustomFullCalendarClickedEvent);
    const customFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.customFullCalendarClickedEvent);
    const openModal = useModalContainerStore((state) => state.openModal);
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const calendarViewMode = useCalendarViewToggleStore((state) => state.calendarViewMode) // 'ATTENDANCE' | 'PERSONAL_SHIFT' | 'ALL_MEMBERS_SHIFT';
    const showModalTopBarEditIcons = useModalTopBarStore((state) => state.showModalTopBarEditIcons)
    const hideModalTopBarEditIcons = useModalTopBarStore((state) => state.hideModalTopBarEditIcons)
    const { modalContentInitialize } = useModalContent()
    const setModalMode = useModalContainerStore((state) => state.setModalMode)


    // イベントクリック ---------------------------------------------------------------------------------------------------
    // 各種モーダルの状態を初期化するための関数
    const initializeModalsAfterClieckedEvent = (customFullCalendarClickedEvent: EventClickArg) => {
        // userかつ自分のイベントの場合
        if (customFullCalendarRole === "user" && customFullCalendarClickedEvent.event.extendedProps.user_id == userId) {
            // シフト個人画面 または全員画面 なら編集アイコンを表示
            if (calendarViewMode === 'PERSONAL_SHIFT' || calendarViewMode === 'ALL_MEMBERS_SHIFT') {
                showModalTopBarEditIcons()
            } else { // シフト全員画面or出退勤なら編集アイコン非表示
                hideModalTopBarEditIcons()
            }

        }

        // adminの場合 編集可能
        if (customFullCalendarRole === "admin") {
            showModalTopBarEditIcons()
        }

        modalContentInitialize('eventClick')
        setModalMode('confirm')
        openModal();
    }

    // フルカレンダーのイベントクリック時に呼ばれる関数
    const handleClickEvent = (eventInfo: EventClickArg) => {
        // 以下条件をどれか満たすなら終了
        // 終日イベント(祝日)
        if (eventInfo.event.allDay) return;

        // フルカレStoreにクリックされたEvent情報保存
        setCustomFullCalendarClickedEvent(eventInfo);

        // 選択されたイベント情報を表示
        console.log("選択されたイベント情報:", eventInfo);
    }

    // フルカレStoreにクリックされたEvent情報保存後 モーダルを更新
    useEffect(() => {
        if (customFullCalendarClickedEvent) {
            // モーダル関連初期化
            initializeModalsAfterClieckedEvent(customFullCalendarClickedEvent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFullCalendarClickedEvent]);



    // 日付クリック  ---------------------------------------------------------------------------------------------------


    const handleClickDate = (info: DateClickArg) => {
        // その日に既に自分のシフトが存在しないか？


        console.log("日付がクリックされました:", info.dateStr);
    };





    return {
        handleClickEvent,
        handleClickDate,
    };
};
