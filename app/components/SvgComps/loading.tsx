import React from 'react';

interface LoadingIconProps {
  size?: number;
  color?: string;
}

function LoadingIcon({ size = 48, color = 'currentColor' }: LoadingIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="2" x2="12" y2="6">
        <animate
          attributeName="y2"
          repeatCount="indefinite"
          dur="1s"
          values="6;2;6"
          keyTimes="0;0.5;1"
        />
      </line>
      <line x1="12" y1="18" x2="12" y2="22">
        <animate
          attributeName="y1"
          repeatCount="indefinite"
          dur="1s"
          values="18;22;18"
          keyTimes="0;0.5;1"
        />
      </line>
      <line x1="2" y1="12" x2="6" y2="12">
        <animate
          attributeName="x2"
          repeatCount="indefinite"
          dur="1s"
          values="6;2;6"
          keyTimes="0;0.5;1"
        />
      </line>
      <line x1="18" y1="12" x2="22" y2="12">
        <animate
          attributeName="x1"
          repeatCount="indefinite"
          dur="1s"
          values="18;22;18"
          keyTimes="0;0.5;1"
        />
      </line>
    </svg>
  );
}

export default LoadingIcon;