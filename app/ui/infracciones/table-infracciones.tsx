//esta tabla va dentro del formulario de alta/edicion de lotes.
"use client";

import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDateToLocal } from "@/app/lib/utils";
import Toast from "../components/Toast/toast";
import * as XLSX from "xlsx";

type Infraccion = {
  nombre_archivo: string;
  fecha: string | Date;
  hora: string;
  velocidad_maxima: number;
  velocidad_medida: number;
  dominio: string;
  marca: string;
  modelo: string;
  imagen_url: string;
  vehiculo_id?: number | null;
};

export default function InfraccionesTable({
  datos,
  onSelectImage,
  selectedRow,
}: {
  datos: Infraccion[];
  onSelectImage?: (url: string, nombreArchivo: string) => void;
  selectedRow?: string | null;
}) {
  const [infracciones, setInfracciones] = useState<Infraccion[]>(datos);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setInfracciones(datos);
  }, [datos]);

  const handleChange = (
    index: number,
    field: keyof Pick<Infraccion, "dominio" | "marca" | "modelo">,
    value: string
  ) => {
    const updated = [...infracciones];
    updated[index][field] = value;
    setInfracciones(updated);
  };

  const buscarVehiculo = async (index: number, dominio: string) => {
    if (!dominio.trim()) return;

    setLoadingIndex(index);

    try {
      const res = await fetch(
        `/api/vehiculo?dominio=${encodeURIComponent(dominio.toUpperCase())}`
      );

      const updated = [...infracciones];

      if (!res.ok) {
        updated[index].marca = "-";
        updated[index].modelo = "-";
      } else {
        const vehiculo = await res.json();
        updated[index].marca = vehiculo.marca || "-";
        updated[index].modelo = vehiculo.modelo || "-";
        updated[index].vehiculo_id = vehiculo.id || "-";
      }

      setInfracciones(updated);
    } catch (error) {
      console.error("Error al consultar dominio:", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const valor = infracciones[index].dominio.trim().toLowerCase();

    if (valor === "x") {
      const nombreArchivo = infracciones[index].nombre_archivo;
      const updated = [...infracciones];
      updated.splice(index, 1);
      setInfracciones(updated);

      if (selectedRow === nombreArchivo) {
        onSelectImage?.("", "");
      }
    } else {
      buscarVehiculo(index, valor);
    }
  };

  const exportarDominiosNoEncontrados = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const tieneDominioVacio = infracciones.some((inf) => !inf.dominio.trim());

    if (tieneDominioVacio) {
      setToastMsg("Complete todos los campos de dominio antes de descargar.");
      return;
    }

    const noEncontrados = infracciones
      .filter((inf) => inf.marca === "-" && inf.modelo === "-")
      .map((inf) => ({ Dominio: inf.dominio }));

    if (noEncontrados.length === 0) {
      setToastMsg("Todos los dominios tienen datos.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(noEncontrados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "No encontrados");

    XLSX.writeFile(workbook, "dominios_no_encontrados.xlsx");
  };

  return (
    <>
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            {/* Vista Mobile */}
            <div className="md:hidden">
              {datos.map((inf, index) => (
                <div
                  key={index}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex justify-between border-b pb-2">
                    <div>
                      <p className="text-sm text-gray-600">Archivo</p>
                      <p className="text-base font-medium">
                        {inf.nombre_archivo}
                      </p>
                    </div>
                    <span className="text-gray-400 italic">-</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>Fecha: {formatDateToLocal(inf.fecha)}</p>
                    <p>Hora: {inf.hora}</p>
                    <p>Vel. máx: {inf.velocidad_maxima}</p>
                    <p>Vel. medida: {inf.velocidad_medida}</p>
                    <p>Dominio: {inf.dominio}</p>
                    <p>Marca: {inf.marca}</p>
                    <p>Modelo: {inf.modelo}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista Desktop */}
            <div className="overflow-x-auto">
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th className="px-4 py-5 font-medium">Archivo</th>
                    <th className="px-3 py-5 font-medium">Fecha</th>
                    <th className="px-3 py-5 font-medium">Hora</th>
                    <th className="px-3 py-5 font-medium">Vel. máx</th>
                    <th className="px-3 py-5 font-medium">Vel. medida</th>
                    <th className="px-3 py-5 font-medium">Dominio</th>
                    <th className="px-3 py-5 font-medium">Marca</th>
                    <th className="px-3 py-5 font-medium">Modelo</th>
                    <th className="px-3 py-5 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {infracciones.map((inf, index) => (
                    <tr
                      key={index}
                      onClick={(e) => {
                        const tag = (e.target as HTMLElement).tagName;
                        if (
                          tag !== "INPUT" &&
                          tag !== "BUTTON" &&
                          tag !== "SVG" &&
                          tag !== "PATH"
                        ) {
                          onSelectImage?.(inf.imagen_url, inf.nombre_archivo);
                        }
                      }}
                      className={`border-b py-3 text-sm last-of-type:border-none cursor-pointer ${
                        selectedRow === inf.nombre_archivo ? "bg-sky-100" : ""
                      }`}
                    >
                      <td className="max-w-[30px] overflow-x-scroll whitespace-nowrap py-3">
                        {inf.nombre_archivo}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {inf.fecha ? formatDateToLocal(inf.fecha) : "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {inf.hora}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {inf.velocidad_maxima}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {inf.velocidad_medida}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <input
                          type="text"
                          value={inf.dominio}
                          onChange={(e) =>
                            handleChange(index, "dominio", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onFocus={() =>
                            onSelectImage?.(inf.imagen_url, inf.nombre_archivo)
                          }
                          className="w-full bg-transparent px-1 py-0.5 text-sm focus:outline-none focus:ring-0"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {loadingIndex === index
                          ? "Buscando..."
                          : inf.marca || "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {loadingIndex === index ? "" : inf.modelo || "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = [...infracciones];
                            updated.splice(index, 1);
                            setInfracciones(updated);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {infracciones.length > 0 && (
          <button
            onClick={exportarDominiosNoEncontrados}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Descargar dominios
          </button>
        )}
      </div>
      {toastMsg && (
        <Toast
          message={toastMsg}
          type="info"
          position="top-right"
          onClose={() => setToastMsg(null)}
        />
      )}
    </>
  );
}
