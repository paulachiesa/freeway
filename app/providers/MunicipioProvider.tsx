// app/providers/MunicipioProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
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

export function MunicipioProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const param = searchParams.get("municipio");
  const [selected, setSelected] = useState<Municipio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMunicipio = async (id: number) => {
      try {
        const res = await fetch(`/api/municipios/${id}`);
        if (!res.ok) throw new Error("Error al cargar municipio");
        const data = await res.json();
        saveMunicipio(data);
      } catch (e) {
        console.error("No se pudo cargar el municipio");
        clearMunicipio();
      } finally {
        setLoading(false);
      }
    };

    const local = sessionStorage.getItem("municipio");

    if (param) {
      loadMunicipio(Number(param));
    } else if (local) {
      try {
        const parsed = JSON.parse(local);
        setSelected(parsed);
      } catch {
        sessionStorage.removeItem("municipio");
        setSelected(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [param]);

  const saveMunicipio = (mun: Municipio) => {
    setSelected(mun);
    sessionStorage.setItem("municipio", JSON.stringify(mun));
    document.cookie = `municipio_id=${mun.id}; path=/`; // opcional: para uso SSR
  };

  const clearMunicipio = () => {
    setSelected(null);
    sessionStorage.removeItem("municipio");
    document.cookie = `municipio_id=; path=/; max-age=0`;
  };

  return (
    <MunicipioContext.Provider
      value={{ selected, setSelected, saveMunicipio, clearMunicipio, loading }}
    >
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
