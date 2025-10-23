"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/app/ui/components/Modal/modal";
import Toast from "../components/Toast/toast";

export default function CreateActa({
  isOpen,
  onClose,
  loteId,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  loteId: number | null;
  onConfirm: (fecha1: string, fecha2: string) => void;
}) {
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const handleConfirm = () => {
    if (!fecha1 || !fecha2) {
      setToastType("warning");
      setToastMsg("Debe seleccionar ambas fecha de vencimiento");
      return;
    }

    const date1 = new Date(fecha1);
    const date2 = new Date(fecha2);

    if (date2 <= date1) {
      setToastType("warning");
      setToastMsg("La 2° fecha de vencimiento debe ser mayor que la 1°");
      return;
    }

    onConfirm(fecha1, fecha2);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      // 🔹 Se limpia al cerrar el modal
      setFecha1("");
      setFecha2("");
      setToastMsg(null);
    }
  }, [isOpen]);

  if (!loteId) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Generar Actas - Lote ${loteId}`}
      >
        <div className="flex flex-col gap-4">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="text-sm font-medium text-gray-700">
                1° Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={fecha1}
                onChange={(e) => setFecha1(e.target.value)}
                className="border border-gray-300 rounded w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                2° Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={fecha2}
                onChange={(e) => setFecha2(e.target.value)}
                className="border border-gray-300 rounded w-full px-3 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
      {toastMsg && (
        <Toast
          message={toastMsg}
          type={toastType}
          position="top-right"
          onClose={() => setToastMsg(null)}
        />
      )}
    </>
  );
}
