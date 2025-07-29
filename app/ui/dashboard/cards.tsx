"use client";

import { useEffect, useState } from "react";
import { lusitana } from "@/app/ui/fonts";
import { Municipio } from "@/app/lib/data/types";
import { useMunicipio } from "@/app/providers/MunicipioProvider";

export default function CardWrapper() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const [selectedId, setSelectedId] = useState<string | null>(() => {
  //   if (typeof window !== "undefined") {
  //     const stored = sessionStorage.getItem("municipio");
  //     if (stored) {
  //       const saved: Municipio = JSON.parse(stored);
  //       return String(saved.id);
  //     }
  //   }
  //   return null;
  // });
  const { selected, saveMunicipio } = useMunicipio();

  useEffect(() => {
    fetch("/api/municipios")
      .then((res) => res.json())
      .then((data: Municipio[]) => setMunicipios(data))
      .catch((err) => {
        console.error("Error al cargar municipios:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelect = (mun: Municipio) => {
    // debugger;
    // setSelectedId(String(mun.id));
    // sessionStorage.setItem("municipio", JSON.stringify(mun));
    saveMunicipio(mun);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!municipios || municipios.length === 0)
    return <p>No hay municipios cargados.</p>;

  return (
    <>
      {municipios.map((mun) => (
        <div
          key={mun.id}
          onClick={() => handleSelect(mun)}
          className={`block cursor-pointer rounded-lg transition-shadow ${
            selected?.id === mun.id ? "ring-4 ring-blue-400" : "hover:shadow-lg"
          }`}
        >
          <Card title={mun.ciudad} value={mun.nombre} />
        </div>
      ))}
    </>
  );
}

export function Card({
  title,
  value,
}: {
  title: string | null;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm w-64">
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
