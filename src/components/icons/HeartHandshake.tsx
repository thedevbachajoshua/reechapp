import React from 'react';

export default function HeartHandshake({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M150 100 C 180 105, 180 95, 200 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M160 100 
           C 140 70, 60 70, 40 100 
           L 40 100 
           C 20 80, 50 40, 70 50 
           C 75 40, 90 40, 95 50 
           C 100 40, 115 40, 120 50 
           C 125 40, 140 40, 145 50 
           L 155 95 
           C 160 100, 160 100, 160 100 Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M40 100 L 40 100 
           C 20 80, 50 40, 70 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M70 50 C 75 40, 90 40, 95 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M95 50 C 100 40, 115 40, 120 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M120 50 C 125 40, 140 40, 145 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M150 90 C 130 90, 80 85, 60 90"
        fill="none"
        stroke="black"
        strokeWidth="5"
        opacity="0.4"
      />
    </svg>
  );
}
