"use client";

import { ReactNode } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded shadow-lg flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
