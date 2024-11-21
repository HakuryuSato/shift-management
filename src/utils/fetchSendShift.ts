import type InterFaceShiftQuery from "@/types/InterFaceShiftQuery";

export default async function fetchSendShift(shiftData: InterFaceShiftQuery | InterFaceShiftQuery[]) {
    const response = await fetch("/api/sendShift", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shiftData),
    });
  
    return await response.json();
  }