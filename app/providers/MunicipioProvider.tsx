// app/providers/MunicipioProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getMunicipioById } from "@/app/lib/data/municipio.data";
import { Municipio } from "../lib/data/types";

interface MunicipioContextValue {
  selected: Municipio | null;
}

const MunicipioContext = createContext<MunicipioContextValue | undefined>(
  undefined
);

export function MunicipioProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const param = searchParams.get("municipio");
  const [selected, setSelected] = useState<Municipio | null>(null);

  useEffect(() => {
    if (param) {
      getMunicipioById(Number(param)).then((m) => setSelected(m));
    }
  }, [param]);

  return (
    <MunicipioContext.Provider value={{ selected }}>
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
