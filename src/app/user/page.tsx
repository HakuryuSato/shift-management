// pages/login.js

"use client";

import { useState, FormEvent} from 'react';

export default function LoginPage() {
  const [userName, setUserName] = useState('');
  const [citePassword, setCitePassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ログイン処理
    console.log({ userName, citePassword });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>本名:</label>
        <input 
          type="text" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
        />
      </div>
      <div>
        <label>パスワード:</label>
        <input 
          type="password" 
          value={citePassword} 
          onChange={(e) => setCitePassword(e.target.value)} 
        />
      </div>
      <button type="submit">ログイン</button>
    </form>
  );
}
