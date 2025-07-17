"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/app/ui/components/Pagination/pagination";
import Search from "@/app/ui/components/Search/search";
import Table from "@/app/ui/lotes/table-lote";
import { CreateLote } from "@/app/ui/lotes/buttons";
import { lusitana } from "@/app/ui/fonts";
import { useMunicipio } from "@/app/providers/MunicipioProvider";
import Toast from "@/app/ui/components/Toast/toast";
import Spinner from "@/app/ui/components/Spinner/spinner";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selected: municipio, loading } = useMunicipio();

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [totalPages, setTotalPages] = useState<number>(0);
  const [loadingPages, setLoadingPages] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !municipio) {
      setToastMsg("Debe seleccionar un municipio primero.");
      router.push("/dashboard");
    }
  }, [loading, municipio]);

  useEffect(() => {
    const fetchPages = async () => {
      if (!municipio) return;

      setLoadingPages(true);
      try {
        const res = await fetch(
          `/api/lotes/pages?query=${encodeURIComponent(query)}&municipioId=${
            municipio.id
          }`
        );
        const data = await res.json();

        if (data.success) {
          setTotalPages(data.totalPages);
        } else {
          setToastMsg(data.message || "No se pudieron cargar las páginas.");
        }
      } catch (err) {
        console.error(err);
        setToastMsg("Error inesperado al cargar las páginas.");
      } finally {
        setLoadingPages(false);
      }
    };

    fetchPages();
  }, [query, municipio, currentPage]);

  if (loading || loadingPages) {
    return (
      <>
        {toastMsg && (
          <Toast
            message={toastMsg}
            type="error"
            position="top-right"
            onClose={() => setToastMsg(null)}
          />
        )}
        <Spinner />
      </>
    );
  }

  if (!municipio) return null;

  return (
    <div className="w-full">
      {toastMsg && (
        <Toast
          message={toastMsg}
          type="error"
          position="top-right"
          onClose={() => setToastMsg(null)}
        />
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Lotes de infracciones
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar..." />
        <CreateLote />
      </div>
      <Table
        query={query}
        currentPage={currentPage}
        municipioId={municipio.id}
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
