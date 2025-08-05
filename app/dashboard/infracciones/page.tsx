// app/dashboard/infracciones/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Search from "@/app/ui/components/Search/search";
import Table from "@/app/ui/lotes/table-lote";
import Pagination from "@/app/ui/components/Pagination/pagination";
import { CreateLote } from "@/app/ui/lotes/buttons";
import { lusitana } from "@/app/ui/fonts";

export default async function Page({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const cookieStore = await cookies();
  const ck = cookieStore.get("municipio_id")?.value;

  if (!ck) {
    return redirect("/dashboard");
  }
  const municipioId = Number(ck);

  const query = searchParams.query ?? "";
  const currentPage = Number(searchParams.page) || 1;

  const params = new URLSearchParams({
    query,
    municipioId: String(municipioId),
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const pagesRes = await fetch(`${baseUrl}/api/lotes/pages?${params}`, {
    cache: "no-store",
  });
  const { success, totalPages } = await pagesRes.json();

  return (
    <>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>
            Lotes de infracciones
          </h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search
            placeholder="Buscar..."
            initialQuery={query}
            basePath="/dashboard/infracciones"
          />
          <CreateLote />
        </div>
        <Table
          query={query}
          currentPage={currentPage}
          municipioId={municipioId}
        />
        <div className="mt-5 flex w-full justify-center">
          <Pagination
            totalPages={success ? totalPages : 0}
            currentPage={currentPage}
            basePath="/dashboard/infracciones"
            query={query}
          />
        </div>
      </div>
    </>
  );
}
