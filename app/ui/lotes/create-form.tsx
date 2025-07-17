"use client";

import React, { useActionState, useState, useEffect } from "react";
import Image from "next/image";
import { formatDateInput } from "@/app/lib/utils";
import { lusitana } from "@/app/ui/fonts";
import { guardarLoteCompleto } from "@/app/lib/actions/lote.actions";
import InfraccionesTable from "../infracciones/table-infracciones";
import defaultImg from "@/public/default.png";
import Toast from "../components/Toast/toast";

type InfraccionData = {
  nombre_archivo: string;
  fecha: string | Date;
  hora: string;
  velocidad_maxima: number;
  velocidad_medida: number;
  dominio: string;
  marca: string;
  modelo: string;
  imagen_url: string;
};

export default function Form({ initialLote }: { initialLote?: any }) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const imageToShow = selectedImageUrl?.trim() ? selectedImageUrl : defaultImg;
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const [radares, setRadares] = useState<{ id: number; nombre: string }[]>([]);

  const [loteData, setLoteData] = useState({
    fecha_desde: "",
    fecha_hasta: "",
    estado: "",
    radar_id: "",
    directorio: "",
    infracciones: [] as InfraccionData[],
  });

  useEffect(() => {
    const fetchRadares = async () => {
      try {
        const res = await fetch("/api/radares");
        const data = await res.json();
        setRadares(data);
      } catch (error) {
        console.error("Error al cargar radares:", error);
      }
    };

    fetchRadares();
  }, []);

  useEffect(() => {
    if (initialLote) {
      setLoteData({
        fecha_desde: formatDateInput(initialLote.fecha_desde),
        fecha_hasta: formatDateInput(initialLote.fecha_hasta),
        estado: initialLote.estado,
        radar_id: String(initialLote.radar_id ?? ""),
        directorio: "",
        // infracciones: initialLote.infraccion ?? [],
        infracciones: initialLote.infraccion.map((i: InfraccionData) => ({
          ...i,
          fecha: typeof i.fecha === "string" ? i.fecha : i.fecha.toISOString(),
        })),
      });
    }
  }, [initialLote]);

  const handleFilesUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    const txtFiles = files.filter((f) => f.name.toLowerCase().endsWith(".txt"));

    const jpgFiles = files.filter((f) => {
      const name = f.name.toLowerCase();
      return name.endsWith(".jpg") || name.endsWith(".jpeg");
    });

    const infracciones: InfraccionData[] = await Promise.all(
      txtFiles.map(async (file) => {
        const text = await file.text();
        const nombreBase = file.name
          .substring(0, file.name.lastIndexOf("."))
          .toLowerCase();

        const fechaMatch = text.match(/Fecha:(\d{2}\/\d{2}\/\d{4})/);
        const horaMatch = text.match(/(\d{2}h\d{2}min\d{2}s)/);
        const vMaxMatch = text.match(/V\.Max:(\d+)/);
        const velMatch = text.match(/Vel:(\d+)/);

        const imagen = jpgFiles.find((img) => {
          const imgBase = img.name
            .substring(0, img.name.lastIndexOf("."))
            .toLowerCase();
          return imgBase === nombreBase;
        });

        if (!imagen) {
          console.warn(`⚠️ No se encontró imagen para: ${file.name}`);
        }

        return {
          nombre_archivo: file.name,
          fecha: fechaMatch?.[1] ?? "",
          hora: horaMatch?.[1]?.replace(/h|min|s/g, ":").slice(0, -1) ?? "",
          velocidad_maxima: Number(vMaxMatch?.[1] ?? 0),
          velocidad_medida: Number(velMatch?.[1] ?? 0),
          dominio: "",
          marca: "",
          modelo: "",
          imagen_url: imagen ? URL.createObjectURL(imagen) : "",
        };
      })
    );

    setLoteData((prev) => ({ ...prev, infracciones }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLoteData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleGuardarClick() {
    const municipio = sessionStorage.getItem("municipio");
    if (municipio) {
      const formData = {
        municipio_id: JSON.parse(municipio).id,
        ...loteData,
        radar_id: parseInt(loteData.radar_id),
      };

      const result = await guardarLoteCompleto(formData);

      if (result.success) {
        setToastType("success");
        setToastMsg("Lote guardado correctamente");
      } else {
        setToastType("error");
        setToastMsg("Error al guardar el lote: " + result.message);
      }
    } else {
      setToastType("warning");
      setToastMsg("Debe tener seleccionado un municipio para guardar.");
    }
  }

  return (
    <>
      <form>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                value={loteData.fecha_desde}
                onChange={handleInputChange}
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
                value={loteData.fecha_hasta}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="estado"
                className="mb-2 block text-sm font-medium"
              >
                Estado
              </label>
              <input
                id="estado"
                name="estado"
                type="text"
                value={loteData.estado}
                onChange={handleInputChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label
                htmlFor="radar_id"
                className="mb-2 block text-sm font-medium"
              >
                Radar
              </label>
              <select
                id="radar_id"
                name="radar_id"
                value={loteData.radar_id}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              >
                <option value="">Seleccionar radar</option>
                {radares.map((radar) => (
                  <option key={radar.id} value={radar.id}>
                    {radar.nombre}
                  </option>
                ))}
              </select>
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
                accept=".txt,image/*"
                onChange={handleFilesUpload}
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              />
            </div>
          </div>

          <h1 className={`${lusitana.className} text-lg`}>Infracciones</h1>
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="w-full md:w-[65%]">
              <InfraccionesTable
                datos={loteData.infracciones}
                onSelectImage={(url, nombreArchivo) => {
                  setSelectedImageUrl(url);
                  setSelectedRow(nombreArchivo);
                }}
                selectedRow={selectedRow}
              />
            </div>
            <div className="w-full md:w-[35%] bg-gray-100 rounded-md p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Visualizador
              </h2>
              <div className="aspect-video w-full bg-white border border-gray-300 rounded-md flex items-center justify-center">
                <Image
                  src={imageToShow}
                  alt="Infracción seleccionada"
                  width={400}
                  height={225}
                  className="object-contain cursor-pointer"
                  onClick={() => selectedImageUrl && setShowModal(true)}
                />
              </div>
            </div>
            {showModal && selectedImageUrl && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-md max-w-4xl max-h-[90vh] overflow-auto relative">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
                  >
                    &times;
                  </button>
                  <img
                    src={selectedImageUrl}
                    alt="Imagen ampliada"
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleGuardarClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Lote
            </button>
          </div>
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
    </>
  );
}
