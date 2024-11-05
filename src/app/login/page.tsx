'use client'

import LoginForm from "@/components/common/LoginForm";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginComponent />
        </Suspense>
    );
};

const LoginComponent = () => {
    const searchParams = useSearchParams();
    const role = searchParams?.get("role") as "user" | "admin" || "user";

    return <LoginForm role={role} />;
};

export default LoginPage;
