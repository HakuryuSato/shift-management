import { useModalContainerStore } from "@/stores/common/modalContainerSlice"



export const useModalContainer = () => {
    const modalMode = useModalContainerStore((state) => state.modalMode)
    const closeModal = useModalContainerStore((state) => state.closeModal)

    
    const handleClickModalContainerButton = () => {
        // ModalModeに応じて条件分岐、apiClientを呼び出して処理を行う
        if (modalMode == 'confirm') {
            closeModal()

        } else if (modalMode == 'register') {

        } else if (modalMode == 'delete') {

        } else if (modalMode == 'update') {

        } else if (modalMode == 'multiple-register') {

        }

    }

    return { handleClickModalContainerButton }
}