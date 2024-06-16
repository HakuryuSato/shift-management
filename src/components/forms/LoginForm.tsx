'use cliant';
import Button from "@ui/Button";

const LoginForm = () => {
    return (
        <Button text="ログイン" onClick={() => { console.log('Button clicked'); }}/>
    );
};

export default LoginForm;