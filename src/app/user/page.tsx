"use client";
import { useEffect, useState } from "react";

import useUserSession from "@api/useUserSession";
import DayGridCalendar from "@forms/DayGridCalendar";
import UserLoginForm from "@components/forms/UserLoginForm";

export default function UserPage() {
    const user = useUserSession();

    return (
        <>
            {user ? <DayGridCalendar /> : <UserLoginForm />}
        </>
    );
}

