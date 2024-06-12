import { useState } from 'react';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ログインの実際の処理を追加
    if (username === 'example' && password === 'password') {
      // ログイン成功時の処理
      router.push('/dashboard');
    } else {
      // ログイン失敗時の処理
      alert('ログインに失敗しました。');
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>ユーザー名:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>パスワード:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}

export default Login;
