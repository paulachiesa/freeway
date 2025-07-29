"use client";

import { useMunicipio } from "@/app/providers/MunicipioProvider";
import { useRouter } from "next/navigation";

export default function Header() {
  const { selected } = useMunicipio();
  const router = useRouter();

  const goToHome = () => {
    router.push("/dashboard");
  };

  return (
    <header className="w-full bg-white border-b p-4 flex items-center justify-start">
      <div className="cursor-pointer" onClick={goToHome}>
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
