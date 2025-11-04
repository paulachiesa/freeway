"use client";

import { useState, Suspense } from "react";
import { Button } from "@/app/ui/button";
import Spinner from "@/app/ui/components/Spinner/spinner";
import Toast from "@/app/ui/components/Toast/toast";
import Search from "@/app/ui/components/Search/search";
import Pagination from "@/app/ui/components/Pagination/pagination";
import { MunicipiosTableSkeleton as PersonasTableSkeleton } from "@/app/ui/skeletons";
import dynamic from "next/dynamic";

const ActasTable = dynamic(() => import("@/app/ui/gestion/actas/actas-table"), {
  ssr: true,
});

interface Props {
  query: string;
  currentPage: number;
  totalPages: number;
}

export default function ActasReportesClient({
  query,
  currentPage,
  totalPages,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/reportes/actas?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Error al generar el reporte");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_actas.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setToastType("success");
      setToastMsg("El reporte se descargó correctamente.");
    } catch (error) {
      console.error(error);
      setToastType("error");
      setToastMsg("No se pudo descargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {toastMsg && (
        <Toast
          type={toastType}
          message={toastMsg}
          onClose={() => setToastMsg(null)}
        />
      )}

      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl mb-3">Tabla de Actas - Reportes</h1>

        <Button onClick={handleDownload} disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner size={18} /> Generando reporte...
            </div>
          ) : (
            "📊 Descargar Excel"
          )}
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search
          placeholder="Buscar por nombre, dni, cuil o dominio"
          initialQuery={query}
          basePath="/dashboard/actas"
        />
      </div>

      <Suspense key={query + currentPage} fallback={<PersonasTableSkeleton />}>
        <ActasTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          query={query}
          basePath="/dashboard/actas"
        />
      </div>
    </div>
  );
}
