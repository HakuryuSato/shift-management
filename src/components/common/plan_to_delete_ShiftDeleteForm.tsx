// import React from "react";
// import Modal from "@/components/common/Modal";
// import Button from "@ui/Button";

// type ShiftDeleteModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   shiftId: number;
// };

// // deleteShiftAPI呼び出し
// async function fetchDeleteShift(shiftId: number) {
//   const response = await fetch(`/api/deleteShift?shiftId=${shiftId}`, {
//     method: "DELETE",
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.error);
//   }

//   return result.data;
// }

// // コンポーネント ---------------------------------------------------------------------------------------------------
// const ShiftDeleteModal: React.FC<ShiftDeleteModalProps> = (
//   { isOpen, onClose, shiftId },
// ) => {
//   const handleDeleteClick = () => {
//     fetchDeleteShift(shiftId)
//       .then((response) => {
//         console.log(response);
//         onClose();
//       })
//       .catch((error) => console.error(error));
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <div className="p-4">
//         <h3 className="mb-4 flex justify-center">このシフトを削除しますか？</h3>
//         <div className="pt-10 flex justify-center">
//           <Button text="削除" onClick={handleDeleteClick} />
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ShiftDeleteModal;
