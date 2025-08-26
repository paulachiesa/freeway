import { fetchPersonasPages } from "@/app/lib/data/infractores.data";
import Search from "@/app/ui/components/Search/search";
import { lusitana } from "@/app/ui/fonts";
import { MunicipiosTableSkeleton as PersonasTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import Table from "@/app/ui/gestion/personas/table";
import Pagination from "@/app/ui/components/Pagination/pagination";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPersonasPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl mb-3`}>
          Tabla Infractores
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search
          placeholder="Buscar por nombre, dni o dominio"
          initialQuery={searchParams?.query ?? ""}
          basePath="/dashboard/infractores"
        />
      </div>
      <Suspense key={query + currentPage} fallback={<PersonasTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          query={query}
          basePath="/dashboard/infractores"
        />
      </div>
    </div>
  );
}
