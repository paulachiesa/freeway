"use client";

import { useState } from "react";
import Spinner from "@/app/ui/components/Spinner/spinner";
import Toast from "@/app/ui/components/Toast/toast";

export default function DescargarExcelButton({ query }: { query: string }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/reportes/actas?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Error al generar el Excel");

      // Si tu API devuelve el archivo directamente
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_actas.xlsx";
      a.click();

      setToast({ type: "success", message: "Descarga completada con éxito" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error al descargar el archivo" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
      >
        {loading ? (
          <Spinner size={20} color="white" className="h-6" />
        ) : (
          "Descargar Excel"
        )}
      </button>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}
