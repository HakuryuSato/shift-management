'use client'
import LoginForm from "@/components/common/LoginForm";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
    const searchParams = useSearchParams();
    const role = (searchParams.get("role") as "user" | "admin") || "user";

    return <LoginForm role={role} />;
};

export default LoginPage;
