"use client";

import Link from "next/link";
import React, { useActionState, useState } from "react";
import { lusitana } from "@/app/ui/fonts";
import { createLote, LoteFormState } from "@/app/lib/actions/lote.actions";
import InfraccionesTable from "../infracciones/table-infracciones";

type InfraccionData = {
  nombre_archivo: string;
  fecha: string;
  hora: string;
  velocidad_maxima: number;
  velocidad_medida: number;
  dominio: string;
  marca: string;
  modelo: string;
  imagenUrl: string;
};

export default function Form() {
  const initialState: LoteFormState = { message: null, errors: {} };
  //   const [state, formAction] = useActionState(createLote, initialState);
  const [infracciones, setInfracciones] = useState<any[]>([]);

  const handleFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const txtFiles = files.filter((f) => f.name.endsWith(".txt"));
    const jpgFiles = files.filter(
      (f) => f.name.endsWith(".jpg") || f.name.endsWith(".jpeg")
    );

    const infracciones: InfraccionData[] = [];

    txtFiles.forEach(async (file) => {
      const text = await file.text();
      const nombreBase = file.name.replace(".txt", "");

      const fechaMatch = text.match(/Fecha:(\d{2}\/\d{2}\/\d{4})/);
      const horaMatch = text.match(/(\d{2}h\d{2}min\d{2}s)/);
      const vMaxMatch = text.match(/V\.Max:(\d+)/);
      const velMatch = text.match(/Vel:(\d+)/);

      const imagen = jpgFiles.find((img) => img.name.startsWith(nombreBase));

      infracciones.push({
        nombre_archivo: file.name,
        fecha: fechaMatch?.[1] ?? "",
        hora: horaMatch?.[1]?.replace(/h|min|s/g, ":").slice(0, -1) ?? "",
        velocidad_maxima: Number(vMaxMatch?.[1] ?? 0),
        velocidad_medida: Number(velMatch?.[1] ?? 0),
        dominio: "",
        marca: "",
        modelo: "",
        imagenUrl: imagen ? URL.createObjectURL(imagen) : "",
      });

      setInfracciones([...infracciones]);
    });
  };

  return (
    <form>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label
              htmlFor="nro_lote"
              className="mb-2 block text-sm font-medium"
            >
              Número Lote
            </label>
            <input
              id="nro_lote"
              name="nro_lote"
              type="number"
              // placeholder=""
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="fecha_desde"
              className="mb-2 block text-sm font-medium"
            >
              Fecha Desde
            </label>
            <input
              id="fecha_desde"
              name="fecha_desde"
              type="date"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="fecha_hasta"
              className="mb-2 block text-sm font-medium"
            >
              Fecha Hasta
            </label>
            <input
              id="fecha_hasta"
              name="fecha_hasta"
              type="date"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[35%_65%] gap-4 mb-8">
          <div>
            <label htmlFor="estado" className="mb-2 block text-sm font-medium">
              Estado
            </label>
            <input
              id="estado"
              name="estado"
              type="text"
              // placeholder=""
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="directorio"
              className="mb-2 block text-sm font-medium"
            >
              Archivos .txt
            </label>
            <input
              id="directorio"
              name="directorio"
              type="file"
              multiple
              accept=".txt,.jpg,.jpeg"
              onChange={handleFilesUpload}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
        </div>

        <div>
          <h1 className={`${lusitana.className} text-lg`}>Infracciones</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="w-full md:w-[65%]">
            <InfraccionesTable datos={infracciones} />
          </div>

          <div className="w-full md:w-[35%] bg-gray-100 rounded-md p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              Visualizador
            </h2>
            <div className="aspect-video w-full bg-white border border-gray-300 rounded-md flex items-center justify-center">
              {/* Imagen simulada */}
              <img
                src="/placeholder.jpg"
                alt="Infracción seleccionada"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
