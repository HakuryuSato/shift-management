"use client";

import { useEffect, useState } from "react";
import type InterFaceShiftQuery from "@/customTypes/InterFaceShiftQuery";

// API  ---------------------------------------------------------------------------------------------------
// シフト取得
export async function fetchGetShift(params: InterFaceShiftQuery) {
  const query = new URLSearchParams(params as any).toString();

  try {
    const response = await fetch(`/api/getShift?${query}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const errorData = await response.json();
      console.error("Error details:", errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}


// コンポーネント  ---------------------------------------------------------------------------------------------------
const Home = () => {
  const [data, setData] = useState<{ data: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user_id = '*'

  const context = {
    user_id: "*",
    year: 2024,
    month: 7,
  };

  useEffect(() => {
    fetch(`/api/getShift?user_id=${user_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <h1>API Routes Example</h1>
      {error
        ? <p>Error: {error}</p>
        : <p>{data ? JSON.stringify(data) : "Loading..."}</p>}
    </div>
  );
};

export default Home;
