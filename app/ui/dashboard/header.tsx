"use client";

import { useMunicipio } from "@/app/providers/MunicipioProvider";

export default function Header() {
  const { selected } = useMunicipio();

  return (
    <header className="w-full bg-white border-b p-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Freeway</h1>
      <div>
        {selected ? (
          <span className="text-gray-700">Municipio: {selected.nombre}</span>
        ) : (
          <span className="text-gray-500 italic">
            Ningún municipio seleccionado
          </span>
        )}
      </div>
    </header>
  );
}
