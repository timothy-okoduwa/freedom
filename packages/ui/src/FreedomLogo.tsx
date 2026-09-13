import React from 'react';

interface FreedomLogoProps {
  size?: number;
  className?: string;
  useImage?: boolean;
}

export function FreedomLogo({ size = 24, className = '', useImage = true }: FreedomLogoProps) {
  if (useImage) {
    return (
      <img
        src="/freedom.png"
        alt="Freedom Logo"
        width={size}
        height={size}
        className={`object-contain rounded-full shrink-0 ${className}`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="-16 -16 132 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
    >
      {/* Outer Circle with Top-Right Opening */}
      <path
        d="M 68 22 A 40 40 0 1 0 74 34"
        stroke="#2F6FED"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Center Right Chevron Arrow */}
      <path
        d="M 45 38 L 57 50 L 45 62"
        stroke="#2F6FED"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
