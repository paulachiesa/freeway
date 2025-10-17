import Pagination from "@/app/ui/components/Pagination/pagination";
import Search from "@/app/ui/components/Search/search";
import Table from "@/app/ui/usuarios/table";
import { CreateUser } from "@/app/ui/usuarios/buttons";
import { lusitana } from "@/app/ui/fonts";
import { MunicipiosTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchUsersPages } from "@/app/lib/data/user.data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchUsersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Usuarios</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search
          placeholder="Buscar usuarios..."
          initialQuery={searchParams?.query ?? ""}
          basePath="/dashboard/gestion/usuarios"
        />
        <CreateUser />
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
          basePath="/dashboard/gestion/usuarios"
        />
      </div>
    </div>
  );
}
