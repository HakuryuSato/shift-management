// AdminSelectPage.tsx
"use client";
import React from "react";
import Button from "@ui/Button";

interface AdminSelectPageProps {
  onButtonClick: (page: string) => void;
}

const AdminSelectPage: React.FC<AdminSelectPageProps> = ({ onButtonClick }) => {
  return (
    <div className="h-screen justify-center flex flex-col items-center space-y-10 py-100">
      <Button
        text="シフト承認"
        onClick={() => onButtonClick("TimeGridCalendar")}
        className="text-[3vw] py-[2vh] px-[4vw] w-[30vw]"
      />
      <Button
        text="ユーザー管理"
        onClick={() => onButtonClick("")}
        className="text-[3vw] py-[2vh] px-[4vw] w-[30vw]"
      />

      <Button
        text="ログアウト"
        onClick={() => onButtonClick("Logout")}
        className="text-[1vw] py-[1vh] px-[1vw]"
      />
    </div>
  );
};

export default AdminSelectPage;
