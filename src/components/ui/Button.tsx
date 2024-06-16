'use client';
import React from 'react';


interface ButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      value={text}
      className="
      bg-blue
      text-white
      px-4
      py-2
      rounded
      cursor-pointer
      "
      onClick={onClick}
    >
    </button>
  );
};

export default Button;
