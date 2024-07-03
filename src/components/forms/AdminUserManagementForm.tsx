"use client";
import React, { useState } from "react";
import Button from "@ui/Button";
import Input from "@ui/Input";
import sendUser from "@api/sendUser";
import deleteUser from "@api/deleteUser";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "register" | "delete";
};

const AdminUserManagementForm: React.FC<ModalProps> = ({ isOpen, onClose, mode }) => {
  const [userName, setUserName] = useState<string>("");

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleActionClick = () => {
    if (mode === "register") {
      sendUser(userName);
    } else if (mode === "delete") {
      deleteUser(userName);
    }
    setUserName("")
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{mode === "register" ? "ユーザー登録" : "ユーザー削除"}</h2>
        </div>

        <div className="p-4">
          <h3 className="mb-4 flex justify-center">
            {mode === "register" ? "登録するユーザー名を入力してください" : "削除するユーザー名を入力してください"}
          </h3>
          <div className="flex justify-center items-center space-x-2">
            <Input
              inputText={userName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserName(e.target.value)
              }
            />
          </div>
          <div className="pt-10 flex justify-center">
            <Button text={mode === "register" ? "登録" : "削除"} onClick={handleActionClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementForm;
