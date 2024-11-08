import { useModalContainerStore } from '@/stores/common/modalContainerSlice';

// ModalのModeを指定して表示するHooks
// export function useModalHooks() {
//     const setModalMode = useModalStore((state) => state.setmodalMode);
//     const setIsModalVisible = useModalStore((state) => state.setIsModalVisible);

//     const openConfirmModal = () => {
//         setModalMode('confirm');
//         setIsModalVisible(true);
//     };

//     const openRegisterModal = () => {
//         setModalMode('register');
//         setIsModalVisible(true);
//     };

//     const openDeleteModal = () => {
//         setModalMode('delete');
//         setIsModalVisible(true);
//     };

//     const openMultipleRegisterModal = () => {
//         setModalMode('multiple-register');
//         setIsModalVisible(true);
//     };

//     // モーダルを閉じる関数
//     const closeModal = () => {
//         setIsModalVisible(false);
//     };




//     return {
//         openConfirmModal,
//         openRegisterModal,
//         openDeleteModal,
//         openMultipleRegisterModal,
//         closeModal,
//     };
// }
