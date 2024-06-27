// 未テストのため全てコメントアウト
// "use client";
// import Button from "@ui/Button";
// import Input from "@ui/Input";
// import { useState } from "react";
// import { supabase } from "@utils/supabase/supabase";

// const UserRegistrationForm = () => {
//     const [email, setEmail] = useState("");
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState<string | null>(null);

//     const handleRegister = async () => {
//         const { error } = await supabase.auth.signUp({
//             email,
//             password,
//             options: {
//                 data: { username },
//             },
//         });

//         if (error) {
//             setError(error.message);
//         } else {
//             setError(null);
//         }
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
//                 <h3>メールアドレス</h3>
//                 <Input
//                     inputText={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="example@example.com"
//                 />

//                 <h3 className="mt-4">ユーザー名</h3>
//                 <Input
//                     inputText={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     placeholder="山田太郎"
//                 />

//                 <h3 className="mt-4">パスワード</h3>
//                 <Input
//                     inputText={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="********"
//                     type="password"
//                 />
//             </div>

//             <div>
//                 <Button text="登録" onClick={handleRegister} />
//             </div>
//         </div>
//     );
// };

// export default UserRegistrationForm;