import Pagination from "@/app/ui/components/Pagination/pagination";
import Search from "@/app/ui/components/Search/search";
import Table from "@/app/ui/lotes/table-lote";
import { CreateLote } from "@/app/ui/lotes/buttons";
import { lusitana } from "@/app/ui/fonts";
import { MunicipiosTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchLotesPages } from "@/app/lib/data/lote.data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const cookieStore = await cookies();
  const municipioId = cookieStore.get("municipio_id")?.value;

  if (!municipioId) {
    // alert("Debe tener seleccionado un municipio primero.");
    redirect("/dashboard");
  }

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchLotesPages(query, Number(municipioId));

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Lotes de infracciones
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar..." />
        <CreateLote />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<MunicipiosTableSkeleton />}
      >
        <Table
          query={query}
          currentPage={currentPage}
          municipioId={Number(municipioId)}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
