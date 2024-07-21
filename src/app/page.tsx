"use client";

import { useEffect, useState } from "react";
import type InterFaceShiftQuery from "@/customTypes/InterFaceShiftQuery";

// API  ---------------------------------------------------------------------------------------------------
// シフト取得
// export async function fetchGetShift(params: InterFaceShiftQuery) {
//   const query = new URLSearchParams(params as any).toString();

//   try {
//     const response = await fetch(`/api/getShift?${query}`, {
//       method: "GET",
//     });

//     if (!response.ok) {
//       console.error(`Error: ${response.status} - ${response.statusText}`);
//       const errorData = await response.json();
//       console.error("Error details:", errorData);
//       return null;
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return null;
//   }
// }


// コンポーネント  ---------------------------------------------------------------------------------------------------
const Home = () => {
  return (
    <div>
      <h1>Hello Back End API</h1>
      {/* {error
        ? <p>Error: {error}</p>
        : <p>{data ? JSON.stringify(data) : "Loading..."}</p>} */}
    </div>
  );
};

export default Home;
