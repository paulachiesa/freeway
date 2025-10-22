"use client";

import { useEffect, useState } from "react";
import { formatDateToLocal } from "@/app/lib/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Spinner from "../components/Spinner/spinner";
import CreateActa from "./create-actas";

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
  const [generandoId, setGenerandoId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null);

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

  const handleGenerarPDFs = async (
    loteId: number,
    fecha1: string,
    fecha2: string
  ) => {
    try {
      setGenerandoId(loteId);

      const response = await fetch(`/api/lotes/${loteId}/generar-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_vencimiento_1: fecha1,
          fecha_vencimiento_2: fecha2,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error generando PDFs");
      }

      // creación del zip
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `lote-${loteId}-pdfs.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar PDFs:", error);
      alert("Hubo un error al generar los PDFs");
    } finally {
      setGenerandoId(null);
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
                          disabled={generandoId === lote.id}
                          className="rounded-md border p-2 bg-blue-600 hover:bg-blue-500 font-medium text-white h-12"
                          onClick={() => {
                            setSelectedLoteId(lote.id);
                            setIsModalOpen(true);
                          }}
                        >
                          {generandoId === lote.id ? (
                            <Spinner color="white" size={30} className="h-15" />
                          ) : (
                            "Generar PDFs"
                          )}
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

          <CreateActa
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            loteId={selectedLoteId}
            onConfirm={(fecha1, fecha2) => {
              if (!selectedLoteId) return;
              handleGenerarPDFs(selectedLoteId, fecha1, fecha2);
              setIsModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
