// app/providers/MunicipioProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Municipio } from "../lib/data/types";

interface MunicipioContextValue {
  selected: Municipio | null;
  setSelected: (mun: Municipio) => void;
  saveMunicipio: (mun: Municipio) => void;
  clearMunicipio: () => void;
  loading: boolean;
}

const MunicipioContext = createContext<MunicipioContextValue | undefined>(
  undefined
);

export function useMunicipio() {
  const ctx = useContext(MunicipioContext);
  if (!ctx)
    throw new Error("useMunicipio debe usarse dentro de MunicipioProvider");
  return ctx;
}

export function MunicipioProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Municipio | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem("municipio");
      return raw ? (JSON.parse(raw) as Municipio) : null;
    } catch {
      sessionStorage.removeItem("municipio");
      return null;
    }
  });

  // const loadMunicipio = async (id: number) => {
  //   try {
  //     const res = await fetch(`/api/municipios/${id}`);
  //     if (!res.ok) throw new Error("Error al cargar municipio");
  //     const data: Municipio = await res.json();
  //     saveMunicipio(data);
  //   } catch {
  //     clearMunicipio();
  //   }
  // };

  useEffect(() => {
    if (selected) {
      sessionStorage.setItem("municipio", JSON.stringify(selected));
      document.cookie = `municipio_id=${selected.id};path=/`;
    } else {
      sessionStorage.removeItem("municipio");
      document.cookie = "municipio_id=;path=/;max-age=0";
    }
  }, [selected]);

  const saveMunicipio = (mun: Municipio) => setSelected(mun);
  const clearMunicipio = () => setSelected(null);

  // const saveMunicipio = (mun: Municipio) => {
  //   setSelected(mun);
  //   sessionStorage.setItem("municipio", JSON.stringify(mun));
  //   document.cookie = `municipio_id=${mun.id}; path=/`;
  // };

  // const clearMunicipio = () => {
  //   setSelected(null);
  //   sessionStorage.removeItem("municipio");
  //   document.cookie = `municipio_id=; path=/; max-age=0`;
  // };

  return (
    <MunicipioContext.Provider
      value={{ selected, setSelected, saveMunicipio, clearMunicipio, loading }}
    >
      {children}
    </MunicipioContext.Provider>
  );
}
