"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  role: "user" | "admin";
}

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const router = useRouter();
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // ローディング開始
    const res = await signIn("credentials", {
      redirect: false,
      input1,
      input2,
      role,
    });

    setLoading(false); // ローディング終了
    if (res && res.error) {
      setError("ログインに失敗しました。入力内容を確認してください。");
    } else if (res && res.ok) {
      router.push(role === "admin" ? "/dev/admin_kanrisha" : "/user");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} textAlign="center">
        <Typography variant="h4" gutterBottom>
          {role === "admin" ? "管理者ログイン" : "ユーザーログイン"}
        </Typography>
        <Box mt={4}>
          {role === "user" && (
            <TextField
              fullWidth
              label="お名前"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            label="サイトパスワード"
            type="password"
            value={role === "user" ? input2 : input1}
            onChange={(e) =>
              role === "user"
                ? setInput2(e.target.value)
                : setInput1(e.target.value)}
            margin="normal"
          />
          {role === "admin" && (
            <TextField
              fullWidth
              label="管理者パスワード"
              type="password"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              margin="normal"
            />
          )}
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            sx={{ mt: 3 }}
          >
            ログイン
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
