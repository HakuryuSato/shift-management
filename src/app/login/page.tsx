import LoginForm from "@/components/common/LoginForm";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const LoginPage = ({ searchParams }: Props) => {
  const roleParam = searchParams.role;
  const role = roleParam === "admin" ? "admin" : "user";
  return <LoginForm role={role} />;
};

export default LoginPage;
