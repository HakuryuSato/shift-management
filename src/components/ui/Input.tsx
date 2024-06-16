'use client';
import React from 'react';


interface InputProps {
  inputText: string;
  placeholder: string;
}

const Input: React.FC<InputProps> = ({ inputText, placeholder }) => {
  return (
    <input
      className="
      bg-gray-light
      inline-block
      "
      placeholder={placeholder}
      
      >
    </input>
  );
};

export default Input;
