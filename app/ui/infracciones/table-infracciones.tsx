//esta tabla va dentro del formulario de alta/edicion de lotes.
"use client";

import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

type Infraccion = {
  nombre_archivo: string;
  fecha: string;
  hora: string;
  velocidad_maxima: number;
  velocidad_medida: number;
  dominio: string;
  marca: string;
  modelo: string;
};

export default function InfraccionesTable({ datos }: { datos: Infraccion[] }) {
  const [infracciones, setInfracciones] = useState<Infraccion[]>(datos);

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

    try {
      const res = await fetch(
        `/api/vehiculo?dominio=${encodeURIComponent(dominio.toUpperCase())}`
      );
      if (!res.ok) throw new Error("Dominio no encontrado.");

      const vehiculo = await res.json();

      const updated = [...infracciones];
      updated[index].marca = vehiculo.marca || "";
      updated[index].modelo = vehiculo.modelo || "";
      setInfracciones(updated);
    } catch (error) {
      console.error("Error al consultar dominio:", error);
    }
  };

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Vista Mobile */}
          <div className="md:hidden">
            {datos.map((inf, index) => (
              <div key={index} className="mb-2 w-full rounded-md bg-white p-4">
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
                  <p>Fecha: {inf.fecha}</p>
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
                    className="border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="max-w-[30px] overflow-x-scroll whitespace-nowrap py-3">
                      {inf.nombre_archivo}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">{inf.fecha}</td>
                    <td className="whitespace-nowrap px-3 py-3">{inf.hora}</td>
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
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            buscarVehiculo(index, inf.dominio);
                          }
                        }}
                        className="w-full bg-transparent px-1 py-0.5 text-sm focus:outline-none focus:ring-0"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">{inf.marca}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {inf.modelo}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <button
                        type="button"
                        onClick={() => {
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
                    {/* <td className="whitespace-nowrap px-3 py-3">{inf.dominio}</td>
                  <td className="whitespace-nowrap px-3 py-3">{inf.marca}</td>
                  <td className="whitespace-nowrap px-3 py-3">{inf.modelo}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
