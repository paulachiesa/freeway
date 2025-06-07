import Pagination from "@/app/ui/components/Pagination/pagination";
import Search from "@/app/ui/components/Search/search";
import Table from "@/app/ui/gestion/cuadroTarifario/table";
import { CreateCuadroTarifario } from "@/app/ui/gestion/cuadroTarifario/buttons";
import { lusitana } from "@/app/ui/fonts";
import { MunicipiosTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchCuadroTarifarioPages } from "@/app/lib/data/cuadro-tarifario.data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCuadroTarifarioPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Cuadro Tarifario</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar cuadro tarifario..." />
        <CreateCuadroTarifario />
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
