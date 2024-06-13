// src/app/user/login.tsx
"use client";

import { useState, FormEvent } from 'react';

export default function Login() {
  const [userName, setUserName] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // ログインロジック
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={userName} 
        onChange={(e) => setUserName(e.target.value)} 
        placeholder="Username" 
      />
      <button type="submit">Login</button>
    </form>
  );
}
