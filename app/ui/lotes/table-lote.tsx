//esta tabla va dentro de infracciones/page.tsx
import { fetchFilteredLotes } from "@/app/lib/data/lote.data";
import { formatDateToLocal } from "@/app/lib/utils";
// import { ViewLoteButton } from "@/app/ui/gestion/lotes/buttons"; // componente que vos definas
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function LoteTable({
  query,
  currentPage,
  municipioId,
}: {
  query: string;
  currentPage: number;
  municipioId: number;
}) {
  const lotes = await fetchFilteredLotes(query, currentPage, municipioId);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Vista Mobile */}
          <div className="md:hidden">
            {lotes?.map((lote) => (
              <div
                key={lote.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex justify-between border-b pb-2">
                  <div>
                    <p className="text-sm text-gray-600">N° Lote</p>
                    <p className="text-base font-medium">{lote.numero}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/infracciones/${lote.id}/editar`}>
                      <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                    </Link>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p>Desde: {formatDateToLocal(lote.fecha_desde)}</p>
                  <p>Hasta: {formatDateToLocal(lote.fecha_hasta)}</p>
                  <p>Estado: {lote.estado}</p>
                  <p>Cant. infracciones: {lote.infraccion?.length ?? 0}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Vista Desktop */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">N° Lote</th>
                <th className="px-3 py-5 font-medium">Fecha desde</th>
                <th className="px-3 py-5 font-medium">Fecha hasta</th>
                <th className="px-3 py-5 font-medium">Cantidad</th>
                <th className="px-3 py-5 font-medium">Estado</th>
                <th className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {lotes?.map((lote) => (
                <tr
                  key={lote.id}
                  className="border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {lote.numero}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(lote.fecha_desde)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(lote.fecha_hasta)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {lote.infraccion?.length ?? 0}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{lote.estado}</td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/dashboard/infracciones/${lote.id}/editar`}>
                        <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
