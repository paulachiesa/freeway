"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import clsx from "clsx";

export default function Modal({
  isOpen,
  title,
  onClose,
  children,
  width = "max-w-4xl",
}: {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string; // tailwind max-w-*
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={clsx(
          "relative w-full rounded-2xl bg-white shadow-xl",
          "max-h-[85vh] overflow-auto",
          width
        )}
      >
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
