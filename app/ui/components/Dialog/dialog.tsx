import React from "react";

interface DialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  // 1 botón
  singleButton?: {
    label: string;
    onClick: () => void;
  };
  // 2 botones
  confirmButton?: {
    label: string;
    onClick: () => void;
  };
  cancelButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function Dialog({
  isOpen,
  title,
  message,
  singleButton,
  confirmButton,
  cancelButton,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end space-x-2">
          {singleButton ? (
            <button
              onClick={singleButton.onClick}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {singleButton.label}
            </button>
          ) : (
            <>
              {cancelButton && (
                <button
                  onClick={cancelButton.onClick}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  {cancelButton.label}
                </button>
              )}
              {confirmButton && (
                <button
                  onClick={confirmButton.onClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {confirmButton.label}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
