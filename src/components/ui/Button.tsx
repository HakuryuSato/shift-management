'use client';
import React from 'react';

interface ButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className}) => {
  return (
    <button
      className={`bg-blue text-white px-4 py-2 rounded cursor-pointer ${className}`}

      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
