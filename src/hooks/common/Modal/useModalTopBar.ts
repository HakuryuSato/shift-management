import { useModalContainerStore } from '@/stores/common/modalContainerSlice';

import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";


export const useModalTopBar = () => {
    const closeModal = useModalContainerStore((state) => state.closeModal);
    const setmodalMode = useModalContainerStore((state) => state.setModalMode)
    const openModal = useModalContainerStore((state) => state.openModal)



    // 編集アイコンクリック
    const handleClickEditIcon = () => {
        setmodalMode('update')
        closeModal()
    };

    // 削除アイコンクリック
    const handleClickDeleteIcon = () => {
        setmodalMode('delete')

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