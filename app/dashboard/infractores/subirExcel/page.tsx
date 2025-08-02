"use client";

import { useState } from "react";
import { lusitana } from "@/app/ui/fonts";
import Toast from "@/app/ui/components/Toast/toast";
import Spinner from "@/app/ui/components/Spinner/spinner";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setToastMsg("");

    try {
      const res = await fetch("/api/infractores/upload-excel", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setToastType("success");
        setToastMsg("Excel importado correctamente");
      } else {
        setToastType("error");
        setToastMsg("Error al importar el Excel");
      }
    } catch (error) {
      setToastType("error");
      setToastMsg("Error inesperado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || loading) {
    return (
      <>
        {toastMsg && (
          <Toast
            message={toastMsg}
            type="error"
            position="top-right"
            onClose={() => setToastMsg(null)}
          />
        )}
        <Spinner />
      </>
    );
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl mb-3`}>Subir Excel</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="mt-4 flex justify-start gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Importando..." : "Subir Excel"}
          </button>
        </div>
      </form>
      {toastMsg && (
        <Toast
          message={toastMsg}
          type={toastType}
          position="top-right"
          onClose={() => setToastMsg(null)}
        />
      )}
    </div>
  );
}
