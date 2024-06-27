"use client";
import React from "react";

interface InputProps {
  inputText: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const Input: React.FC<InputProps> = (
  { inputText, placeholder, onChange, type = "text" },
) => {
  return (
    <input
      className="
      bg-gray-light
      inline-block
      border
      border-gray
      p-2
      "
      placeholder={placeholder}
      value={inputText} // 値を反映
      onChange={onChange} // イベントハンドラーを追加
      type={type} // タイプを反映
    >
    </input>
  );
};

export default Input;
