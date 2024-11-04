"use cliant";
import Button from "@ui/Button";
import Input from "@ui/Input";
import Cookies from "js-cookie";
import { useState } from "react";
// import { supabase } from "@api/supabase";
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";

// API呼び出し
import { fetchUserByUsername } from "@utils/client/apiClient";


const COOKIE_USER_LOGGED_IN = process.env
    .NEXT_PUBLIC_COOKIE_USER_LOGGEDIN as string;
const COOKIE_USER_INFO = process.env.NEXT_PUBLIC_COOKIE_USER_INFO as string;
const COOKIE_USER_OPTIONS = process.env
    .NEXT_PUBLIC_COOKIE_USER_OPTIONS as string;



const UserLoginForm = (
    { onLoginSuccess }: {
        onLoginSuccess: (userData: InterFaceTableUsers) => void;
    },
) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (password !== process.env.NEXT_PUBLIC_SITE_PASSWORD) {
            alert("サイトパスワードが間違っています");
            return;
        }

        const user = await fetchUserByUsername(username);
        
        if (!user) {
            alert("ユーザーが存在しません");
            return;
        }

        const userData: InterFaceTableUsers = {
            user_id: user.user_id,
            user_name: username,
            // 他の必要なカラムを追加
        };

        // ログイン成功
        Cookies.set(COOKIE_USER_LOGGED_IN, "true", { expires: 3650 });
        Cookies.set(COOKIE_USER_INFO, JSON.stringify(userData), {
            expires: 365,
        }); // ユーザー情報をクッキーに保存
        onLoginSuccess(userData);
    };

    return (
        <div className="
            h-screen
            justify-center
            flex
            flex-col
            items-center
            space-y-10
            py-100
           ">
            <div>
                <h3>お名前</h3>
                <Input
                    inputText={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="山田太郎"
                />

                <h3 className="mt-4">サイトパスワード</h3>
                <Input
                    inputText={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="QRコード用紙に記載"
                    type="password" // Ensure the password field is type="password"
                />
            </div>

            <div>
                <Button text="ログイン" onClick={handleLogin} />
            </div>
        </div>
    );
};

export default UserLoginForm;
