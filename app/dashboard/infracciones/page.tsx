//aca va la tabla de infracciones: nro lote, desde, hasta, cant. registros, estado, acciones (ver lote -> id/editar/page.tsx). buscador por lote
//antes que nada, pedir seleccionar municipio, para buscar lotes de ese municipio nomas y cargar tabla.
import Pagination from "@/app/ui/components/Pagination/pagination";
import Search from "@/app/ui/components/Search/search";
import Table from "@/app/ui/lotes/table-lote";
import { CreateLote } from "@/app/ui/lotes/buttons";
import { lusitana } from "@/app/ui/fonts";
import { MunicipiosTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchLotesPages } from "@/app/lib/data/lote.data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchLotesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Infracciones</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar..." />
        <CreateLote />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<MunicipiosTableSkeleton />}
      >
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
