"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { lusitana } from "@/app/ui/fonts";
import { Municipio } from "@/app/lib/data/types";

export default function CardWrapper() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReady, setSelectedReady] = useState(false);

  const searchParams = useSearchParams();
  const queryParamId = searchParams.get("municipio");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/municipios")
      .then((res) => res.json())
      .then((data: Municipio[]) => setMunicipios(data))
      .catch((err) => {
        console.error("Error al cargar municipios:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("municipio");
    const saved = stored ? JSON.parse(stored) : null;

    if (!queryParamId && saved) {
      setSelectedId(saved.id);
    }
    setSelectedReady(true); // Marcamos que ya está listo
  }, []);

  console.log(selectedId);

  useEffect(() => {
    if (queryParamId) {
      setSelectedId(queryParamId);
      sessionStorage.setItem("municipio", JSON.stringify({ id: queryParamId }));

      document.cookie = `municipio_id=${queryParamId}; path=/`;
    }
  }, [queryParamId]);

  if (isLoading || !selectedReady) {
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
      {municipios.map((mun, index) => (
        <Link
          key={mun.id}
          href={`?municipio=${mun.id}`}
          className={
            "block cursor-pointer rounded-lg transition-shadow " +
            (selectedId === String(mun.id)
              ? "ring-4 ring-blue-400"
              : "hover:shadow-lg")
          }
        >
          <Card key={mun.id || index} title={mun.ciudad} value={mun.nombre} />
        </Link>
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
