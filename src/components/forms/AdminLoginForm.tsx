'use cliant';
import Button from "@ui/Button";
import Input from "@ui/Input"

const AdminLoginForm = () => {
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
                <h3 className="mt-4">管理者パスワード</h3>
                <Input inputText={""} placeholder=""></Input>
            </div>

            <div>
                <Button text="ログイン" onClick={() => { }}></Button>
            </div>


        </div>
    );
};

export default AdminLoginForm;