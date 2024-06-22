'use cliant';
import Button from "@ui/Button";
import Input from "@ui/Input"

const UserLoginForm = () => {
    return (

        <div
            className="
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
                <Input inputText={""} placeholder="山田太郎" />

                <h3 className="mt-4">サイトパスワード</h3>
                <Input inputText={""} placeholder="QRコード用紙に記載" />
            </div>

            <div>
                <Button text="ログイン" onClick={() => { }} />
            </div>


        </div>
    );
};

export default UserLoginForm;