"use client";

import { useEffect, useState } from "react";
import { formatDateToLocal } from "@/app/lib/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Lote {
  id: number;
  numero: number;
  fecha_desde: string;
  fecha_hasta: string;
  estado: string;
  infraccion: any[];
}

export default function LoteTable({
  query,
  currentPage,
  municipioId,
}: {
  query: string;
  currentPage: number;
  municipioId: number;
}) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLotes = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/lotes/listado?query=${query}&page=${currentPage}&municipioId=${municipioId}`
        );
        const data = await res.json();

        if (data.success) {
          setLotes(data.lotes);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Error al obtener lotes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (municipioId) {
      fetchLotes();
    }
  }, [query, currentPage, municipioId]);

  const handleGenerarPDFs = async (loteId: number) => {
    // try {
    //   const res = await fetch(`/api/lotes/${loteId}/pdfs`);

    //   if (!res.ok) {
    //     console.error("Error al traer datos del lote");
    //     return;
    //   }

    //   const data = await res.json();

    //   // 👉 ver todo el objeto
    //   console.log("✅ Datos del lote:", data);

    //   // 👉 ejemplo: recorrer las infracciones
    //   data.infracciones.forEach((inf: any, idx: number) => {
    //     console.log(
    //       `#${idx + 1} Infracción ${inf.id} - Dominio: ${inf.dominio}, Fecha: ${
    //         inf.fecha
    //       }`
    //     );
    //   });
    // } catch (err) {
    //   console.error("Error en handleGenerarPDFs:", err);
    // }
    try {
      const res = await fetch(`/api/lotes/${loteId}/pdfs`);
      if (!res.ok) {
        console.error("Error generando PDFs");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lote-${loteId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error en handleDescargarPDFs:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Vista Mobile */}
          <div className="md:hidden">
            {lotes?.map((lote) => (
              <div
                key={lote.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex justify-between border-b pb-2">
                  <div>
                    <p className="text-sm text-gray-600">N° Lote</p>
                    <p className="text-base font-medium">{lote.numero}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/infracciones/${lote.id}/editar`}>
                      <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                    </Link>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p>Desde: {formatDateToLocal(lote.fecha_desde)}</p>
                  <p>Hasta: {formatDateToLocal(lote.fecha_hasta)}</p>
                  <p>Estado: {lote.estado}</p>
                  <p>Cant. infracciones: {lote.infraccion?.length ?? 0}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Vista Desktop */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">N° Lote</th>
                <th className="px-3 py-5 font-medium">Fecha desde</th>
                <th className="px-3 py-5 font-medium">Fecha hasta</th>
                <th className="px-3 py-5 font-medium">Cantidad</th>
                <th className="px-3 py-5 font-medium">Estado</th>
                <th className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {lotes?.map((lote) => (
                <tr
                  key={lote.id}
                  className="border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {lote.numero}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(lote.fecha_desde)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(lote.fecha_hasta)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {lote.infraccion?.length ?? 0}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{lote.estado}</td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/dashboard/infracciones/${lote.id}/editar`}
                        className="flex items-center"
                      >
                        <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                      </Link>
                      {lote.estado === "Proceso de carga completo" && (
                        <button
                          className="rounded-md border p-2 bg-blue-600 hover:bg-blue-500 font-medium text-white"
                          onClick={() => handleGenerarPDFs(lote.id)}
                        >
                          Generar PDFs
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {lotes.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-gray-500"
                    colSpan={5}
                  >
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
