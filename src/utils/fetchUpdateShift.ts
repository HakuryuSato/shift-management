import type InterFaceShiftQuery from "@/types/InterFaceShiftQuery";

export default async function fetchUpdateShift(shiftData: InterFaceShiftQuery) {
    const response = await fetch("/api/updateShift", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(shiftData),
    });

    return await response.json();
}
