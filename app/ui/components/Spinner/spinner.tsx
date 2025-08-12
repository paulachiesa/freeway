"use client";

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function Spinner({
  size = 40,
  color = "blue-500",
  className = "h-40",
}: SpinnerProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-${color}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
    </div>
  );
}
