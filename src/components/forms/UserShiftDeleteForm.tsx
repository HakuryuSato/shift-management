import React from "react";
import Modal from "@/components/common/Modal";
import Button from "@ui/Button";
import deleteShift from "@api/deleteShift";

type ShiftDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  shiftId: number;
};

const ShiftDeleteModal: React.FC<ShiftDeleteModalProps> = ({ isOpen, onClose, shiftId }) => {
  const handleDeleteClick = () => {
    deleteShift(shiftId)
      .then((response: any) => {
        console.log(response);
        onClose();
      })
      .catch((error: any) => console.error(error));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h3 className="mb-4 flex justify-center">このシフトを削除しますか？</h3>
        <div className="pt-10 flex justify-center">
          <Button text="削除" onClick={handleDeleteClick} />
        </div>
      </div>
    </Modal>
  );
};

export default ShiftDeleteModal;
