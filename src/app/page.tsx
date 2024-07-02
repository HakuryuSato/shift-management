"use client";
import AdminShiftTable from "@forms/AdminShiftTable";

export default function HomePage() {
  
  return (
    <AdminShiftTable
      onButtonClick={() => handleButtonClick("TimeGridCalendar")}
    />
  );
}
