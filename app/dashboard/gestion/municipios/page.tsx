import Pagination from "@/app/ui/components/Pagination/pagination";
import Search from "@/app/ui/components/Search/search";
import Table from "@/app/ui/gestion/municipios/table";
import { CreateMunicipio } from "@/app/ui/gestion/municipios/buttons";
import { lusitana } from "@/app/ui/fonts";
import { MunicipiosTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchMunicipiosPages } from "@/app/lib/data/municipio.data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchMunicipiosPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Municipios</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search
          placeholder="Buscar municipios..."
          initialQuery={searchParams?.query ?? ""}
          basePath="/dashboard/gestion/municipios"
        />
        <CreateMunicipio />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<MunicipiosTableSkeleton />}
      >
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          query={query}
          basePath="/dashboard/gestion/municipios"
        />
      </div>
    </div>
  );
}
