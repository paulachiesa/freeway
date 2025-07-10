// app/providers/MunicipioProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Municipio } from "../lib/data/types";

interface MunicipioContextValue {
  selected: Municipio | null;
  setSelected: (mun: Municipio) => void;
}

const MunicipioContext = createContext<MunicipioContextValue | undefined>(
  undefined
);

export function MunicipioProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const param = searchParams.get("municipio");
  const [selected, setSelected] = useState<Municipio | null>(null);

  useEffect(() => {
    const loadMunicipio = async (id: number) => {
      try {
        const res = await fetch(`/api/municipios/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSelected(data);
        localStorage.setItem("municipio", JSON.stringify(data));
      } catch (e) {
        console.error("No se pudo cargar el municipio");
        setSelected(null);
        localStorage.removeItem("municipio");
      }
    };

    if (param) {
      loadMunicipio(Number(param));
    } else {
      const local = localStorage.getItem("municipio");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          setSelected(parsed);
        } catch {
          localStorage.removeItem("municipio");
        }
      }
    }
  }, [param]);

  return (
    <MunicipioContext.Provider value={{ selected, setSelected }}>
      {children}
    </MunicipioContext.Provider>
  );
}

export function useMunicipio() {
  const ctx = useContext(MunicipioContext);
  if (!ctx)
    throw new Error("useMunicipio debe usarse dentro de MunicipioProvider");
  return ctx;
}
