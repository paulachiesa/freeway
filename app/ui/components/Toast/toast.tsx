"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  duration?: number; // si no se pasa, no se cierra automáticamente
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  onClose?: () => void;
  type?: "success" | "error" | "warning" | "info";
}

export default function Toast({
  message,
  duration,
  position = "top-right",
  onClose,
  type = "info",
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!duration) return; // 🔹 si no hay duración, no se autodestruye
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const positionClasses = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-center": "top-6 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  };

  const colorClasses = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-600",
  };

  return (
    <div
      className={`fixed z-50 flex items-center justify-between gap-3 rounded px-4 py-2 text-white shadow-lg animate-fadeIn ${colorClasses[type]} ${positionClasses[position]}`}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="ml-2 text-white font-bold hover:opacity-80"
      >
        ✕
      </button>
    </div>
  );
}
