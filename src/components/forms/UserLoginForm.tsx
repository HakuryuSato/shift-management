"use cliant";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useState } from "react";
import { supabase } from "@utils/supabase/supabase";

const UserLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password,
        });

        // console.log(email, password);
        // console.log("Login error:", error);

        if (error) {
            setError(error.message);
        } else {
            setError(null);
        }
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
                    inputText={email}
                    onChange={(e) => setEmail(e.target.value)}
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
