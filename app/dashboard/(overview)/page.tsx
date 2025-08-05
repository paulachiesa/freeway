import { Suspense } from "react";
import CardWrapper from "@/app/ui/dashboard/cards";

export default async function Page({
  searchParams,
}: {
  searchParams: { municipio?: string };
}) {
  return (
    <>
      <Suspense fallback={<p className="p-4">Cargando dashboard…</p>}>
        <div className="min-h-96 flex justify-center items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CardWrapper />
        </div>
      </Suspense>
    </>
  );
}
