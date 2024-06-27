"use client";
import { useEffect, useState } from "react";

import useUserSession from "@api/useUserSession";
import DayGridCalendar from "@forms/DayGridCalendar";
import UserLoginForm from "@components/forms/UserLoginForm";

export default function UserPage() {
    const user = useUserSession();

    return (
        <>
            {user
                ? (
                    <div>
                        <h1>Welcome, {user.user_name}!</h1>
                        <p>User ID: {user.user_id}</p>
                    </div>
                )
                : <h1>Please log in.</h1>}
        </>
    );
}
