import { useModalContainerStore } from '@/stores/common/modalContainerSlice';
import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalContentStore } from '@/stores/common/modalContentSlice';
import { useCustomFullCalendarStore } from '@/stores/common/customFullCalendarSlice';

// ISO時間からHH:MMのみを抽出する関数
const extractHHMMfromISOString = (isoString: string) => {
    return isoString.slice(11, 16);
}

export const useModalTopBar = () => {
    const closeModal = useModalContainerStore((state) => state.closeModal);
    const setmodalMode = useModalContainerStore((state) => state.setModalMode)
    const setModalContentSelectedStartTime = useModalContentStore((state) => state.setModalContentSelectedStartTime)
    const setModalContentSelectedEndTime = useModalContentStore((state) => state.setModalContentSelectedEndTime)
    const customFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.customFullCalendarClickedEvent)
    const hideModalTopBarEditIcons = useModalTopBarStore(
        (state) => state.hideModalTopBarEditIcons,
    );

    // 編集アイコンクリック
    const handleClickEditIcon = () => {
        // モードを更新に、編集アイコン非表示
        setmodalMode('update')
        hideModalTopBarEditIcons()

        // 選択されたイベントの時間を状態に設定
        const startTime = extractHHMMfromISOString(customFullCalendarClickedEvent?.event.startStr || "");
        const endTime = extractHHMMfromISOString(customFullCalendarClickedEvent?.event.endStr || "");
        setModalContentSelectedStartTime(startTime)
        setModalContentSelectedEndTime(endTime)


    };

    // 削除アイコンクリック
    const handleClickDeleteIcon = () => {
        // モードを削除に、編集アイコン非表示
        setmodalMode('delete')
        hideModalTopBarEditIcons()
    };

    // 閉じるアイコンクリック
    const handleClickCloseIcon = () => {
        closeModal()
    }


    return {
        handleClickEditIcon,
        handleClickDeleteIcon,
        handleClickCloseIcon,
    };
};