import Pagination from "@/app/ui/components/Pagination/pagination";
import Search from "@/app/ui/components/Search/search";
import Table from "@/app/ui/gestion/radares/table";
import { CreateRadar } from "@/app/ui/gestion/radares/buttons";
import { lusitana } from "@/app/ui/fonts";
import { MunicipiosTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchRadarPages } from "@/app/lib/data/radar.data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchRadarPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Radares</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search
          placeholder="Buscar radares..."
          initialQuery={searchParams?.query ?? ""}
          basePath="/dashboard/gestion/radares"
        />
        <CreateRadar />
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
          basePath="/dashboard/gestion/radares"
        />
      </div>
    </div>
  );
}
