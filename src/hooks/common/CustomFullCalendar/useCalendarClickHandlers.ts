import { useEffect } from "react";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalContent } from "@/hooks/common/Modal/useModalContent"
import { isUserCalendarEventOnDate } from "@/utils/client/isUserCalendarEventOnDate";


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
    const customFullCalendarClickedDate = useCustomFullCalendarStore((state) => state.customFullCalendarClickedDate);
    const openModal = useModalContainerStore((state) => state.openModal);
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const calendarViewMode = useCalendarViewToggleStore((state) => state.calendarViewMode) // 'ATTENDANCE' | 'PERSONAL_SHIFT' | 'ALL_MEMBERS_SHIFT';
    const showModalTopBarEditIcons = useModalTopBarStore((state) => state.showModalTopBarEditIcons)
    const hideModalTopBarEditIcons = useModalTopBarStore((state) => state.hideModalTopBarEditIcons)
    const { modalContentInitialize } = useModalContent()
    const setModalMode = useModalContainerStore((state) => state.setModalMode)
    const customFullCalendarPersonalShiftEvents = useCustomFullCalendarStore((state) => state.customFullCalendarPersonalShiftEvents)


    // イベントクリック ---------------------------------------------------------------------------------------------------
    // クリックされたEventをフルカレStoreにsetした際 モーダルを更新
    useEffect(() => {
        if (customFullCalendarClickedEvent) {
            // モーダル関連初期化
            initializeModalsAfterClieckedEvent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFullCalendarClickedEvent]);

    // 各種モーダルの状態を初期化するための関数
    const initializeModalsAfterClieckedEvent = () => {

        // (user かつ シフト個人画面) または 管理者 なら編集アイコンを表示
        // 出退勤なら編集アイコン非表示
        const shouldShowEditIcons = (customFullCalendarRole === "user" && calendarViewMode === 'PERSONAL_SHIFT')
            || customFullCalendarRole === "admin";
        shouldShowEditIcons ? showModalTopBarEditIcons() : hideModalTopBarEditIcons();

        modalContentInitialize('eventClick')
        setModalMode('confirm')
        openModal();
    }

    // フルカレンダーのイベントクリック時に呼ばれる関数
    const handleClickEvent = (eventInfo: EventClickArg) => {
        // 終日イベント(祝日) または ユーザーかつ全員シフト画面 なら終了
        if (eventInfo.event.allDay || (customFullCalendarRole === "user" && calendarViewMode === 'ALL_MEMBERS_SHIFT')) return;

        // フルカレStoreにクリックされたEvent情報保存 -> useEffectが実行
        setCustomFullCalendarClickedEvent(eventInfo);

        // 選択されたイベント情報を表示
        // console.log("選択されたイベント情報:", eventInfo);
    }






    // 日付クリック  ---------------------------------------------------------------------------------------------------
    // クリックされたDateをフルカレStoreにsetした際 モーダルを更新
    useEffect(() => {
        if (customFullCalendarClickedDate) {
            // console.log("選択された日付情報:", customFullCalendarClickedDate);
            // モーダル関連初期化
            initializeModalsAfterClieckedDate(customFullCalendarClickedDate);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFullCalendarClickedDate]);



    const initializeModalsAfterClieckedDate = (customFullCalendarClickedDate: DateClickArg) => {
        // イベントがあるかどうかを判定
        console.log(customFullCalendarPersonalShiftEvents)


        // userかつ、個人シフトかつ、その日にイベントがない？
        // if (customFullCalendarRole === "user" && customFullCalendarClickedDate.event.extendedProps.user_id == userId) {
        //     // シフト個人画面 または全員画面 なら編集アイコンを表示
        //     if (calendarViewMode === 'PERSONAL_SHIFT' || calendarViewMode === 'ALL_MEMBERS_SHIFT') {
        //         showModalTopBarEditIcons()
        //     } else { // シフト全員画面or出退勤なら編集アイコン非表示
        //         hideModalTopBarEditIcons()
        //     }

        // }

        // adminの場合 編集可能
        if (customFullCalendarRole === "admin") {
            showModalTopBarEditIcons()
        }

        modalContentInitialize('dateClick')
        setModalMode('register')
        openModal();
    }


    // フルカレンダーの日付クリック時に呼ばれる関数
    const handleClickDate = (dateInfo: DateClickArg) => {
        console.log(dateInfo.dateStr)

        // userかつ個人画面以外　または　すでに該当ユーザーのイベントが存在する なら終了
        if ((customFullCalendarRole === 'user' && calendarViewMode !== 'PERSONAL_SHIFT')
            || isUserCalendarEventOnDate(dateInfo.dateStr, userId, customFullCalendarPersonalShiftEvents))
            return;

        // 管理者ならばテキストを整形
        if(customFullCalendarRole === 'admin'){
            // ISO文字列からYYYY-MM-DD部分を抽出
            const formattedDate = dateInfo.dateStr.split('T')[0];
            dateInfo.dateStr = formattedDate;
        }



        // 日付データを状態にセット
        setCustomFullCalendarClickedDate(dateInfo);

    };






    return {
        handleClickEvent,
        handleClickDate,
    };
};
