// "use cliant";

// // common/LoginFormへ切替後に廃止予定　 ---------------------------------------------------------------------------------------------------

// import Button from "@ui/Button";
// import Input from "@ui/Input";
// import Cookies from "js-cookie";
// import { useState } from "react";




// const COOKIE_ADMIN_ISLOGGEDIN = process.env.NEXT_PUBLIC_COOKIE_ADMIN_ISLOGGEDIN as string

// const AdminLoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
//     const [adminpassword, setAdminPassword] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState<string | null>(null);

//     const handleLogin = async () => {
//         if (password !== process.env.NEXT_PUBLIC_SITE_PASSWORD) {
//             alert("サイトパスワードが間違っています");
//             return;
//         }

//         if (adminpassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
//             alert("管理者パスワードが間違っています");
//             return;
//         }

//         // ログイン成功
//         Cookies.set(COOKIE_ADMIN_ISLOGGEDIN, "true", { expires: 3650 });
//         onLoginSuccess();
//     };

//     return (
//         <div className="
//             h-screen
//             justify-center
//             flex
//             flex-col
//             items-center
//             space-y-10
//             py-100
//            ">
//             <div>
//                 <h3>サイトパスワード</h3>
//                 <Input
//                     inputText={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     type="password" // Ensure the password field is type="password"
//                 />

//                 <h3 className="mt-4">管理者パスワード</h3>
//                 <Input
//                     inputText={adminpassword}
//                     onChange={(e) => setAdminPassword(e.target.value)}
//                     type="password" // Ensure the password field is type="password"
//                 />
//             </div>

//             <div>
//                 <Button text="ログイン" onClick={handleLogin} />
//             </div>
//         </div>
//     );
// };

// export default AdminLoginForm;
